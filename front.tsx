"use client"

import React, { useState } from 'react';
import axios from 'axios';

const base_url = "http://localhost:3001/data"

const Search = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUrl(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = { key: url }; // Replace with your actual data

    try {
      const response = await axios.post(base_url, postData);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1> ytb-captions </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="Enter URL"
          required
        />
        <br />
        <button type="submit">Get subtitles</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <h1>
      <Search />
    </h1> 
  );
}