// Health check endpoint - returns server status and current time
export async function GET() {
  return Response.json({
    ok: true,
    time: new Date().toISOString()
  });
}
