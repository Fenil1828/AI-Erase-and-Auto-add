export async function GET() {
  const apiKeyConfigured = !!process.env.REMOVE_BG_API_KEY;
  
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured,
    message: apiKeyConfigured 
      ? 'API key is configured' 
      : 'API key is NOT configured. Set REMOVE_BG_API_KEY in .env.local file'
  });
}
