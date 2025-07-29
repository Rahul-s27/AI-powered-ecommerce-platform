export async function tryOnWithLightX({ userPhoto, clothingImg, prompt }: { userPhoto: File, clothingImg?: File | null, prompt?: string }) {
  const formData = new FormData();
  formData.append("user", userPhoto);
  if (clothingImg) formData.append("clothing", clothingImg);
  if (prompt) formData.append("prompt", prompt);

  const res = await fetch("http://localhost:8000/api/tryon", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("LightX API failed");
  const data = await res.json();
  return data.image_url;
}
