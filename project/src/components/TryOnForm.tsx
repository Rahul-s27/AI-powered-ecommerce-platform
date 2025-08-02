import { useState } from "react";
import axios from "axios";

const TryOnForm = () => {
  const [userImage, setUserImage] = useState("");
  const [clothImage, setClothImage] = useState("");
  const [result, setResult] = useState("");

  const handleTryOn = async () => {
    const res = await axios.post("http://localhost:8000/api/tryon", {
      user_image_url: userImage,
      cloth_image_url: clothImage
    });
    setResult(res.data.result_url);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="User Image URL"
        value={userImage}
        onChange={(e) => setUserImage(e.target.value)}
        className="border p-2 m-2 w-full"
      />
      <input
        type="text"
        placeholder="Cloth Image URL"
        value={clothImage}
        onChange={(e) => setClothImage(e.target.value)}
        className="border p-2 m-2 w-full"
      />
      <button
        onClick={handleTryOn}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Try On
      </button>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Result</h2>
          <img src={result} alt="Virtual Try-On Result" className="mt-2 w-96" />
        </div>
      )}
    </div>
  );
};

export default TryOnForm;
