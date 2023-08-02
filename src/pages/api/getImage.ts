import { NextApiRequest, NextApiResponse } from 'next';

const tokens = [
  "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", "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", "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", "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","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"
];

interface FetchImageResponse {
  data: ArrayBuffer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const url = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4';
  
  const { inputs } = req.body;
  const payload = {
    inputs,
  };

  let success = false;
  let tokenIndex = 0;
  let response;

  while (!success && tokenIndex < tokens.length) {
    try {
      const headers = {
        'Authorization': `Bearer ${tokens[tokenIndex]}`,
      };

      response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        success = true;
      } else {
        tokenIndex++; // 
      }
    } catch (error) {
      tokenIndex++; // 
    }
  }

  if (!success) {
    console.error('Failed to fetch the image');
    return res.status(500).json({ error: 'Failed to fetch the image' });
  }

  try {
    const imageBuffer = await response.arrayBuffer();
    const imageBufferAsBuffer = Buffer.from(imageBuffer);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline; filename="image.jpg"');

    res.status(200).end(imageBufferAsBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the image' });
  }
}
