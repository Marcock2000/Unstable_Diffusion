import React, { useState } from 'react';

const ImageFetchComponent: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');

  const fetchImage = async () => {
    const endpoint = '/api/getImage'; // Replace with the actual endpoint URL

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the image');
      }

      const imageBuffer = await response.arrayBuffer();
      const imageDataUrl = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`;
      setImageDataUrl(imageDataUrl);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchImage();
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          className="rounded-l-lg border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
        />
        <button
          type="submit"
          className="px-8 rounded-r-lg bg-green-500 text-white font-bold p-4 uppercase border-green-600 border-t border-b border-r"
        >
          Fetch Image
        </button>
      </form>
      {imageDataUrl && <img src={imageDataUrl} alt="Fetched Image" className="mt-4 rounded-lg shadow-lg" />}
    </div>
  );
};

export default ImageFetchComponent;
