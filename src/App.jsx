import React, { useState } from 'react';
import './App.css';

function App() {
  const [urls, setUrls] = useState(['', '', '']);
  const [metadata, setMetadata] = useState([]);
  const [error, setError] = useState('');

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMetadata([]);

    if (urls.filter(url => url.trim() !== '').length < 3) {
      setError('Please enter at least 3 URLs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/fetch-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();
      if (response.ok) {
        setMetadata(data);
      } else {
        setError(data.message || 'Failed to fetch metadata');
      }
    } catch (err) {
      setError('Failed to fetch metadata');
    }
  };

  return (
    <div className="App">
      <h1>URL Metadata Fetcher</h1>
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <div key={index}>
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder={`Enter URL ${index + 1}`}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="metadata-container">
        {metadata.map((meta, index) => (
          <div key={index} className="metadata-card">
            <h2>{meta.title}</h2>
            <p>{meta.description}</p>
            {meta.image && <img src={meta.image} alt={meta.title} style={{ width: '200px', height: 'auto' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;