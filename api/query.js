// api/query.js - Vercel Serverless Function
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // For now, return simulated data until MCP is available in API
    // This shows the UI works - real Hedera data requires MCP which is only in Claude.ai
    const simulatedResponse = {
      textResponses: [
        `Demo Response for: "${query}"\n\n` +
        `Note: Real-time Hedera data requires MCP integration which is currently only available in Claude.ai, not the public API.\n\n` +
        `To use real data:\n` +
        `1. Use this UI to design your queries\n` +
        `2. Ask me (Claude) in the chat to run them with real Hedera MCP data\n` +
        `3. I'll fetch live blockchain data and show you the results\n\n` +
        `This is a working demo of the UI - the data flow is: UI → Backend → Anthropic API → (MCP not yet supported) → Simulated Response`
      ],
      toolResults: 'MCP servers are not yet supported in the Anthropic public API. Use Claude.ai chat interface for real Hedera data queries.',
      fullResponse: []
    };

    res.status(200).json(simulatedResponse);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}