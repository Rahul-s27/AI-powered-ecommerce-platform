import React from "react";

export default function TryOnResultDisplay({ imageUrl }) {
  if (!imageUrl) return null;
  return (
    <div className="flex flex-col items-center my-4">
      <img src={imageUrl} alt="Photorealistic Try-On Result" className="rounded-lg border shadow max-w-full" />
      <div className="text-gray-600 mt-2">Photorealistic Try-On Result</div>
    </div>
  );
}
