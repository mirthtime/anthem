export const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('origin') || '';
  
  // Allowed origins - update these with your actual domains
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'https://triptunes.ai', // Replace with your actual domain
    'https://www.triptunes.ai', // Replace with your actual domain
  ];
  
  // Check if the origin is allowed
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
  
  // Only allow specific origins in production
  if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
    return {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
    };
  }
  
  // For production, deny requests from unknown origins
  return corsHeaders;
};