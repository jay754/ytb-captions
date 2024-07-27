"use client"

import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/data', { url }, { responseType: 'blob' });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'subtitles.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Fetch YouTube Subtitles</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="Enter YouTube URL"
          required
        />
        <br />
        <button type="submit">Fetch Subtitles</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div >Error: {error}</div>}
    </div>
  );
};

export default Search;