const express = require('express');
const bodyParser = require('body-parser');
const {
  getSubtitles
} = require('youtube-captions-scraper');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

app.post('/data', async (req, res) => {
  const videoId = req.body.url.split("v=")[1];
  const lang = req.body.lang || 'en';

  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  try {
    const captions = await getSubtitles({
      videoID: videoId,
      lang: lang
    });

    // Prepare the subtitles text
    const subtitlesText = captions.map(caption => `${caption.start} - ${caption.start + caption.dur}: ${caption.text}`).join('\n');

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});