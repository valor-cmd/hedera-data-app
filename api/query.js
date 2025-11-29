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

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: query
        }
      ],
      mcp_servers: [
        {
          type: 'url',
          url: 'https://mainnet.hedera.api.hgraph.io/v1/pk_prod_138b03d98573dd8992cc9af61c748f56e329b09a/mcp',
          name: 'hgraph-mcp'
        }
      ]
    });

    // Extract the response data
    const toolResults = message.content
      .filter(item => item.type === 'mcp_tool_result')
      .map(item => item.content?.[0]?.text || '')
      .join('\n');

    const textResponses = message.content
      .filter(item => item.type === 'text')
      .map(item => item.text);

    res.status(200).json({
      toolResults,
      textResponses,
      fullResponse: message.content
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}