// Main redirect endpoint - tracks clicks and forwards users
// Uses Edge Runtime for maximum speed
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { redirectParamsSchema, extractIP, hashIP, buildRedirectURL, isValidDestination } from '@/lib/utils';
import { insertClick, type ClickRecord } from '@/lib/supabase';

// Use Edge Runtime for fastest redirects
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  try {
    // Validate and normalize input parameters
    const params = redirectParamsSchema.parse({
      client: searchParams.get('client'),
      service: searchParams.get('service'),
      industry: searchParams.get('industry'),
      channel: searchParams.get('channel'),
      campaign: searchParams.get('campaign') || undefined, // Convert null to undefined
      dest: searchParams.get('dest')
    });

    // Double-check destination URL is safe
    if (!isValidDestination(params.dest)) {
      return createErrorPage('Invalid destination URL', 'The destination must be a valid http:// or https:// URL');
    }

    // Generate unique click ID
    const clickId = uuidv4();

    // Extract request metadata
    const headers = request.headers;
    const referer = headers.get('referer');
    const userAgent = headers.get('user-agent');
    const rawIP = extractIP(headers);

    // Hash IP for privacy (async operation)
    let ipHash: string | undefined;
    if (rawIP) {
      try {
        ipHash = await hashIP(rawIP);
      } catch (err) {
        console.error('Failed to hash IP:', err);
        // Continue without IP hash
      }
    }

    // Prepare click record
    const clickData: ClickRecord = {
      client: params.client,
      service: params.service,
      industry: params.industry,
      channel: params.channel,
      campaign: params.campaign,
      aff: 'harold', // Always harold for now
      click_id: clickId,
      dest_url: params.dest,
      referer: referer || undefined,
      user_agent: userAgent || undefined,
      ip_hash: ipHash
    };

    // Log click to database (best-effort, don't block redirect)
    insertClick(clickData).catch(err => {
      console.error('Failed to log click, but continuing with redirect:', err);
    });

    // Build final redirect URL with click_id and original params
    const redirectURL = buildRedirectURL(params.dest, clickId, searchParams);

    // Redirect with 302 (temporary redirect)
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectURL,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Redirect endpoint error:', error);

    // Handle validation errors with friendly page
    if (error instanceof Error && error.message.includes('Required')) {
      const missingFields = extractMissingFields(error.message);
      return createErrorPage(
        'Missing Required Parameters',
        `Please provide: ${missingFields.join(', ')}`
      );
    }

    // Generic error page
    return createErrorPage(
      'Invalid Link Format',
      'This tracking link is malformed. Please check the URL and try again.'
    );
  }
}

// Extract missing field names from Zod error
function extractMissingFields(errorMessage: string): string[] {
  const fields = [];
  if (errorMessage.includes('client')) fields.push('client');
  if (errorMessage.includes('service')) fields.push('service');
  if (errorMessage.includes('industry')) fields.push('industry');
  if (errorMessage.includes('channel')) fields.push('channel');
  if (errorMessage.includes('dest')) fields.push('dest');
  return fields;
}

// Create friendly error page for invalid requests
function createErrorPage(title: string, message: string): Response {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Error - Harold's Smart Redirect</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px; 
            margin: 100px auto; 
            padding: 20px; 
            text-align: center;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #dc3545; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; margin-bottom: 30px; }
        .example {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            word-break: break-all;
            margin: 20px 0;
        }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <p>${message}</p>
        
        <p><strong>Required format:</strong></p>
        <div class="example">
            /api/r?client=superboats&service=boat-trip-lisbon&industry=boats&channel=tiktok&dest=https%3A%2F%2Fexample.com
        </div>
        
        <p>
            <a href="/builder">Use the Link Builder</a> to create properly formatted tracking links.
        </p>
    </div>
</body>
</html>`;

  return new Response(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html' }
  });
}
