/**
 * api/index.js
 * Main entry point for the Jailex API.
 */

export default function handler(request, response) {
  // Allow requests from your website (CORS)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    return response.status(200).json({
      status: "online",
      project: "Jailex",
      message: "API folder created and operational!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
}
