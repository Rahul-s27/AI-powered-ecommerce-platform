import React, { useState } from "react";
import MediaPipeOverlay from "../components/MediaPipeOverlay";
import TryOnResultDisplay from "../components/TryOnResultDisplay";
import { tryOnWithLightX } from "../api/tryon";

const TryOn: React.FC = () => {
  // Live Try-On state
  const [liveClothingFile, setLiveClothingFile] = useState<File | null>(null);
  const [liveClothingImage, setLiveClothingImage] = useState<HTMLImageElement | null>(null);
  const [liveClothingPreview, setLiveClothingPreview] = useState<string | null>(null);

  // Photo Try-On state
  const [photoUserFile, setPhotoUserFile] = useState<File | null>(null);
  const [photoClothingFile, setPhotoClothingFile] = useState<File | null>(null);
  const [photoResultUrl, setPhotoResultUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Handlers for Live Try-On
  const handleLiveClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLiveClothingFile(file);
      const url = URL.createObjectURL(file);
      setLiveClothingPreview(url);
      const img = new window.Image();
      img.src = url;
      img.onload = () => setLiveClothingImage(img);
    }
  };

  // Handlers for Photo Try-On
  const handlePhotoUserUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoUserFile(file);
  };
  const handlePhotoClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoClothingFile(file);
  };
  const handlePhotoTryOn = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoResultUrl(null);
    if (photoUserFile && photoClothingFile) {
      setPhotoLoading(true);
      try {
        const url = await tryOnWithLightX({ userPhoto: photoUserFile, clothingImg: photoClothingFile });
        setPhotoResultUrl(url);
      } catch (err) {
        alert("Failed to generate try-on result");
      }
      setPhotoLoading(false);
    } else {
      alert("Please upload both user and clothing images.");
    }
  };

  return (
    <div className="flex flex-col items-center py-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Hybrid Virtual Try-On</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
        {/* Live Try-On Block */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Live Camera Try-On</h3>
          <input type="file" accept="image/png,image/jpeg" onChange={handleLiveClothingUpload} />
          {liveClothingPreview && <img src={liveClothingPreview} alt="Clothing Preview" className="my-4 max-h-32 rounded" />}
          {liveClothingImage && <MediaPipeOverlay clothingImage={liveClothingImage} />}
        </div>
        {/* Photo Try-On Block */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Photorealistic Try-On</h3>
          <form className="flex flex-col gap-4 w-full" onSubmit={handlePhotoTryOn}>
            <label className="font-semibold">Upload Your Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUserUpload} required />
            <label className="font-semibold">Upload Clothing Image</label>
            <input type="file" accept="image/*" onChange={handlePhotoClothingUpload} required />
            <button type="submit" className="btn-primary" disabled={photoLoading}>{photoLoading ? "Generating..." : "Try On (Photo)"}</button>
          </form>
          {photoResultUrl && <TryOnResultDisplay imageUrl={photoResultUrl} />}
        </div>
      </div>
    </div>
  );
};

export default TryOn;
