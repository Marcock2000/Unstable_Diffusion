import type { NextApiRequest, NextApiResponse } from 'next';

const tokens = [
  "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", "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", "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", "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","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"
];


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const url = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4';
  
  const inputs  = req.body as string;
  const payload = inputs

  const success = await retryFetch(0, url, payload);

  if (!success) {
    console.error('Failed to fetch the image');
    return res.status(500).json({ error: 'Failed to fetch the image' });
  }

  try {
    const imageBuffer = await success.arrayBuffer();
    const imageBufferAsBuffer = Buffer.from(imageBuffer);

    // Set the appropriate headers to indicate that the response contains an image
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline; filename="image.jpg"');

    // Send the image data as the response
    res.status(200).end(imageBufferAsBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the image' });
  }
}

async function retryFetch(tokenIndex: number, url: string, payload: string): Promise<Response | null> {
  if (tokenIndex >= tokens.length) {
    return null; // All tokens have been tried, return null to indicate failure
  }

  const headers = {
    'Authorization': `Bearer ${tokens[tokenIndex]}`,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return response; // Successful response
    } else {
      // Retry with the next token
      return retryFetch(tokenIndex + 1, url, payload);
    }
  } catch (error) {
    // Retry with the next token
    return retryFetch(tokenIndex + 1, url, payload);
  }
}
