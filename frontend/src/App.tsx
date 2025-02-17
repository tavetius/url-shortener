import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      {shortenedUrl && (
        <div>
          <p>Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a></p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;
