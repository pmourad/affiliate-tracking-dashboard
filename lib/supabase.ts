// Supabase client factory - SERVER-SIDE ONLY
// Never expose service role key to browser
import { createClient } from '@supabase/supabase-js';

// Database schema types
export interface ClickRecord {
  id?: string;
  created_at?: string;
  client: string;
  service: string;
  industry: string;
  channel: string;
  campaign?: string;
  aff: string;
  click_id: string;
  dest_url: string;
  referer?: string;
  user_agent?: string;
  country?: string;
  ip_hash?: string;
}

// Create server-only Supabase client
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Insert a click record (best-effort - don't fail redirects)
export async function insertClick(clickData: ClickRecord): Promise<boolean> {
  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from('clicks')
      .insert(clickData);

    if (error) {
      console.error('Failed to insert click:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}
