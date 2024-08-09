const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getSubtitles } = require('youtube-captions-scraper');

const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: '*', // or specify the domain making the request
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type'
}));

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

app.post('/data', async (req, res) => {
  let videoId;

  try {
    const videoUrl = req.body.url;
    const parsedUrl = new URL(videoUrl);
    videoId = parsedUrl.searchParams.get("v");

    if (!videoId) {
      videoId = parsedUrl.pathname.split('/')[1];
    }

    console.log("Extracted Video ID:", videoId);
  } catch (err) {
    console.error('Error parsing URL:', err);
    return res.status(400).send('Invalid URL format');
  }

  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  try {
    const subtitles = await getSubtitles({
      videoID: videoId,
      lang: req.body.lang || 'en'
    });

    if (!subtitles || subtitles.length === 0) {
      return res.status(404).send('No subtitles found for this video');
    }

    const subtitlesText = subtitles.map(sub => sub.text).join('\n');

    res.setHeader('Content-Disposition', `attachment; filename=${videoId}_subtitles.txt`);
    res.setHeader('Content-Type', 'text/plain');

    res.send(subtitlesText);
  } catch (err) {
    console.error("Error fetching subtitles:", err.message);
    res.status(500).send('Error fetching subtitles: ' + err.message);
  }
});


const port = process.env.PORT || 3001;

app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3001");
});
