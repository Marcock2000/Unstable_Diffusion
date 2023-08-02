import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import type { SetStateAction } from "react";

const ImageFetchComponent = () => {
  const [inputText, setInputText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const fetchImage = async () => {
    const endpoint = "/api/getImage";

    try {
      setIsLoading(true);
      const fullPrompt = inputText

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: fullPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      const imageBuffer = await response.arrayBuffer();
      const imageDataUrl = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString(
        "base64"
      )}`;
      setImageDataUrl(imageDataUrl);
    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setInputText(event.target.value);
  };


  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!inputText.trim()) {
      alert("Can't generate an image without a prompt, can you?");
      return;
    }
    fetchImage().catch((error) => {
      console.error(error);
      // Handle error
    });
  };
  
  

  const handleTryAnotherPrompt = () => {
    setInputText("");
    setImageDataUrl("");
  };

  return (
    <div className="flex flex-col w-full p-4 border rounded-lg border-black items-center justify center">
      {!imageDataUrl && !isLoading && (
        <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 items-center ">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            className="w-1/2 rounded-lg my-5 border border-slate-700 text-black bg-white px-4 py-2 "
          />

          <button
            type="submit"
            className="rounded-xl bg-black text-white font-bold p-2 uppercase border-white border-2  "
            disabled={isLoading }
          >
            Generate(?)
          </button>
        </form>
      )}

      {isLoading && (
        <div className="loader w-18 h-18 border-2 border-white border-solid rounded-full animate-spin"> | </div>
      )}

      {imageDataUrl && (
        <div className="mt-4 flex flex-col items-center justify-center">
          <Image src={imageDataUrl} alt="Fetched Image" className="rounded-lg shadow-lg" width={512} height={512} />
          <button
            type="button"
            className=" items-center justify-center rounded-xl bg-black text-white my-10 font-bold p-2 uppercase border-white border-2  "
            onClick={handleTryAnotherPrompt}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Head>
        <title>Unstable Diffusion </title>
        <meta name="description" content="Powered by Marco Ramirez" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className="root bg-black flex flex-col items-center justify-center min-h-screen">
          <div className="header w-full flex flex-col items-center justify-center text-white gap-y-4">
            <div className="header-title flex gap-12">
              <h1 className="font-bold  text-center text-6xl mt-4">Unstable Diffusion</h1>
            </div>
            <div className="header-subtitle">
              <h2 className="text-xl font-normal text-opacity-75">
                AI Generated Art, but with really weird outcomes
              </h2>
            </div>
            <ImageFetchComponent />
          </div>
          
      </main>
    </>
  );
};

export default Home;
