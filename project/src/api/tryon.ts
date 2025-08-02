export async function tryOnWithReplicate({ userImageUrl, clothImageUrl }: { userImageUrl: string, clothImageUrl: string }) {
  const res = await fetch("http://localhost:8000/api/tryon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_image_url: userImageUrl, cloth_image_url: clothImageUrl })
  });
  if (!res.ok) throw new Error("Replicate API failed");
  const data = await res.json();
  return data.result_url;
}
