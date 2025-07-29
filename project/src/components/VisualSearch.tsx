import React, { useState, ChangeEvent, FormEvent } from "react";

const VisualSearch: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [detailedDescription, setDetailedDescription] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [flipkartLink, setFlipkartLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setError("");
    setDetailedDescription("");
    setCaption("");
    setProducts([]);
    setFlipkartLink("");
    try {
      const formData = new FormData();
      formData.append("user_image", image);
      const resp = await fetch("/api/visualsearch", {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      if (data.status !== "success") {
        setError(data.message || "Unknown error");
        setLoading(false);
        return;
      }
      setDetailedDescription(data.detailed_description || "");
      setCaption(data.caption || "");
      setProducts(Array.isArray(data.results) ? data.results : []);
      setFlipkartLink(data.flipkart_link || "");
    } catch (err: any) {
      setError("Network error: " + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-4">Visual Search</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4" style={{ width: "100%", maxWidth: 400 }}>
        <label
          htmlFor="file-upload"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: 140,
            border: "2px dashed #90caf9",
            borderRadius: 12,
            background: "rgba(30, 42, 60, 0.65)",
            cursor: "pointer",
            marginBottom: 8,
            transition: "border 0.2s"
          }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setImage(e.dataTransfer.files[0]);
              setPreview(URL.createObjectURL(e.dataTransfer.files[0]));
            }
          }}
        >
          <svg width="40" height="40" fill="#90caf9" viewBox="0 0 24 24" style={{ marginBottom: 8 }}><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.09 2.34 5.64 5.35 5.96C6.6 20.36 9.11 22 12 22c3.64 0 6.67-2.59 7.35-6.04C21.66 19.64 24 17.09 24 14c0-3.09-2.34-5.64-5.35-5.96zM12 20c-2.21 0-4-1.79-4-4h2.5l-2.5-3-2.5 3H8c0 2.21 1.79 4 4 4zm-4-8l2.5 3 2.5-3H8zm8 0h-2.5l2.5 3 2.5-3H16z"/></svg>
          <span style={{ color: "#b3e5fc", fontWeight: 500, fontSize: 15 }}>Choose a file or drag & drop here</span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ display: "none" }}
          />
        </label>
        {preview && (
          <div>
            <img src={preview} alt="preview" style={{ maxWidth: 200, margin: 8, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !image}
          style={{
            background: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(33,150,243,0.09)",
            cursor: loading || !image ? "not-allowed" : "pointer",
            opacity: loading || !image ? 0.7 : 1,
            marginTop: 6
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {!error && (detailedDescription || caption) && (
        <div
          style={{
            marginTop: 24,
            width: "100%",
            maxWidth: 600,
            background: "linear-gradient(135deg, #7f53ac 0%, #657ced 100%)",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(80, 36, 130, 0.18)",
            padding: 24,
            overflowX: "auto",
            wordBreak: "break-word",
            border: "3px solid #fff176"
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 14, color: "#fffde7", letterSpacing: 1 }}>Visual Search Result</h3>
          <div style={{ color: "#fffde7", fontWeight: 500, marginBottom: 10 }}>
            <span style={{ fontWeight: 700 }}>Description:</span><br />
            {detailedDescription}
          </div>
          <div style={{ color: "#fff59d", fontWeight: 600, marginBottom: 4 }}>
            <span style={{ fontWeight: 700 }}>Caption:</span> {caption}
          </div>
        </div>
      )}
      {/* Flipkart Product Results Grid */}
      <div className="mt-8 w-full max-w-5xl">
        {loading && (
          <div style={{ color: "#fff", fontWeight: 500, textAlign: "center", fontSize: 18 }}>Searching Flipkart products...</div>
        )}
        {!loading && products.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            marginTop: 8
          }}>
            {products.map((p, i) => (
              <a
                key={i}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#23272f",
                  borderRadius: 14,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.13)",
                  padding: 18,
                  textDecoration: "none",
                  color: "#fff",
                  minHeight: 320,
                  transition: "transform 0.12s, box-shadow 0.12s",
                  border: "2px solid #374151"
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "contain",
                    background: "#fff",
                    borderRadius: 8,
                    marginBottom: 10
                  }}
                />
                <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8, color: "#fff" }}>{p.title}</div>
                <div style={{ fontWeight: 500, fontSize: 16, color: "#ffeb3b", marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: "#b3b3b3" }}>View on Flipkart →</div>
              </a>
            ))}
          </div>
        )}
        {!loading && products.length === 0 && flipkartLink && (
          <div style={{ color: "#fffde7", fontWeight: 500, textAlign: "center", fontSize: 17, marginTop: 20 }}>
            No products found. <a href={flipkartLink} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 700 }}>View on Flipkart</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearch;
