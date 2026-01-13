import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploadedId, setUploadedId] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadedId("");
    setFinalUrl("");
  };

  const uploadImage = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData
      );
      setUploadedId(res.data.id);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async () => {
    try {
      const res = await axios.get(
        //`http://localhost:5000/generate-url/${uploadedId}`
        `${import.meta.env.VITE_API_URL}/generate-url/${uploadedId}`
      );
      setFinalUrl(res.data.url);
    } catch {
      alert("Could not generate link");
    }
  };

  return (
    <div className="app">
      <div className="vault">
        <h1>Image Vault</h1>
        <p className="subtitle">
          Upload an image and get a temporary secure link.
        </p>

        <input type="file" accept="image/*" onChange={onFileChange} />

        <button onClick={uploadImage} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        {uploadedId && (
          <button className="secondary" onClick={generateLink}>
            Generate Temporary Link
          </button>
        )}

        {finalUrl && (
          <div className="result">
            <p>Your secure link:</p>
            <a href={finalUrl} target="_blank" rel="noreferrer">
              {finalUrl}
            </a>
            <span>Expires in 60 seconds</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
