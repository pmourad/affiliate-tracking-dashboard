// Basic Authentication helper for admin panel
import { NextRequest } from 'next/server';

export interface AuthCredentials {
  username: string;
  password: string;
}

// Parse Basic Auth header
export function parseBasicAuth(authHeader: string | null): AuthCredentials | null {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64 = authHeader.slice(6); // Remove "Basic "
    const decoded = atob(base64);
    const [username, password] = decoded.split(':');
    
    if (!username || !password) {
      return null;
    }
    
    return { username, password };
  } catch {
    return null;
  }
}

// Validate credentials against environment variables
export function validateCredentials(credentials: AuthCredentials): boolean {
  const validUsername = process.env.ADMIN_USER;
  const validPassword = process.env.ADMIN_PASS;
  
  if (!validUsername || !validPassword) {
    console.error('Missing ADMIN_USER or ADMIN_PASS environment variables');
    return false;
  }
  
  return credentials.username === validUsername && credentials.password === validPassword;
}

// Create Basic Auth challenge response
export function createAuthChallenge(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Panel"',
      'Content-Type': 'text/plain'
    }
  });
}

// Middleware to check Basic Auth
export function requireAuth(request: NextRequest): Response | null {
  const authHeader = request.headers.get('authorization');
  const credentials = parseBasicAuth(authHeader);
  
  if (!credentials || !validateCredentials(credentials)) {
    return createAuthChallenge();
  }
  
  return null; // Auth successful
}
