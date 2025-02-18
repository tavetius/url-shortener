import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const isValidUrl = (input: string) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidUrl(url)) {
      setError("❌ Please enter a valid URL.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      const response = await axios.post(
        "/api/shorten",
        { originalUrl: url },
        { headers: { "Content-Type": "application/json" } }
      );      
      setShortenedUrl(response.data.shortUrl);
    } catch (err) {
      setError("Invalid URL or server error");
    }
  };

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl)
        .then(() => {
          setCopySuccess("✅ URL copied to clipboard!");

          setTimeout(() => {
            setCopySuccess("");
          }, 3000);
        })
        .catch(() => setError("❌ Failed to copy."));
    }
  };


  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p className="error">{error}</p>}
      {shortenedUrl && (
        <div className="result">
          <p>Shortened URL: 
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
          </p>
          <button onClick={handleCopy}>Copy</button>
        </div>
      )}

      {copySuccess && <p className="success">{copySuccess}</p>}
    </div>
  );
};

export default App;
