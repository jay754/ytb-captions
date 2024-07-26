import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
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
      const response = await axios.post('http://localhost:3001/data', { url });

      console.log(response);

      setData(response.data); // Assuming the data is under the 'subtitles' key

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Fetch YouTube Subtitles</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="Enter YouTube URL"
          required
          style={styles.input}
        />
        <br />
        <button type="submit" style={styles.button}>Fetch Subtitles</button>
      </form>

      {loading && <div style={styles.loading}>Loading...</div>}
      {error && <div style={styles.error}>Error: {error}</div>}
      {data && (
        <div style={styles.data}>
          <h2>Subtitles:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    marginTop: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    margin: '10px 0',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  loading: {
    marginTop: '20px',
    fontSize: '18px',
  },
  error: {
    marginTop: '20px',
    fontSize: '18px',
    color: 'red',
  },
  data: {
    marginTop: '20px',
    fontSize: '16px',
  },
};

export default Search;
