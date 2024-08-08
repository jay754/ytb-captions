const express = require('express');
const bodyParser = require('body-parser');
const {
  getSubtitles
} = require('youtube-captions-scraper');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

app.post('/data', async (req, res) => {
  let videoId;

  try {
    const videoUrl = new URL(req.body.url);
    videoId = videoUrl.searchParams.get("v");
    
    if (!videoId) {
      // Attempt to extract video ID from a shortened URL or other formats
      videoId = videoUrl.pathname.split('/')[1];
    }
  } catch (err) {
    return res.status(400).send('Invalid URL format');
  }

  const lang = req.body.lang || 'en';

  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  try {
    const captions = await getSubtitles({
      videoID: videoId,
      lang: lang
    });

    if (captions.length === 0) {
      return res.status(404).send('No subtitles found for this video');
    }

    // Prepare the subtitles text, one subtitle per line
    const subtitlesText = captions.map(caption => caption.text).join('\n');

    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename=${videoId}_subtitles.txt`);
    res.setHeader('Content-Type', 'text/plain');

    // Send the subtitles text directly
    res.send(subtitlesText);
  } catch (err) {
    console.log('Error fetching subtitles:', err);
    res.status(500).send('Error fetching subtitles');
  }
});

const port = process.env.PORT || 3001;

app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3001");
});

