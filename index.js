const express = require('express');
const bodyParser = require('body-parser');

const {
  getSubtitles
} = require('youtube-captions-scraper');

const cors = require('cors');

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
    const videoUrl = new URL(req.body.url);
    videoId = videoUrl.searchParams.get("v");

    if (!videoId) {
      videoId = videoUrl.pathname.split('/')[1];
    }

    console.log("Extracted Video ID:", videoId);
  } catch (err) {
    console.error('Error parsing URL:', err);
    return res.status(400).send('Invalid URL format');
  }

  const lang = req.body.lang || 'en';

  if (!videoId) {
    return res.status(400).send('Video ID is required');
  }

  const captions = await getSubtitles({ videoID: 'JWqD_8PiKpE', lang: lang });
  
  console.log("Captions:", captions);

  // try {
  //   const captions = await getSubtitles({ videoID: videoId, lang: lang });
  //   console.log("Captions:", captions);

  //   if (!captions || captions.length === 0) {
  //     return res.status(404).send('No subtitles found for this video');
  //   }

  //   const subtitlesText = captions.map(caption => caption.text).join('\n');

  //   res.setHeader('Content-Disposition', `attachment; filename=${videoId}_subtitles.txt`);
  //   res.setHeader('Content-Type', 'text/plain');

  //   res.send(subtitlesText);
  // } catch (err) {
  //   console.error("Error fetching subtitles:", err);
  //   res.status(500).send('Error fetching subtitles');
  // }
});


const port = process.env.PORT || 3001;

app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3001");
});

