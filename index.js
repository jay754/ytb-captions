const express = require('express');
const bodyParser = require('body-parser');
const { getSubtitles } = require('youtube-captions-scraper');
const fs = require('fs');
const path = require('path');
var cors = require('cors')

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors())

// POST route to handle YouTube subtitle extraction
app.post('/data', async (req, res) => {
    
    const videoId = req.body.key.split("v=")[1]
    
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

        // Define the file path
        const filePath = path.join(__dirname, `${videoId}_subtitles.txt`);

        // Save the subtitles to a file
        fs.writeFile(filePath, subtitlesText, 'utf8', err => {
            if (err) {
                console.log('Error writing file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.send(`Subtitles saved successfully to ${filePath}`);
        });
    } catch (err) {
        console.log('Error fetching subtitles:', err);
        res.status(500).send('Error fetching subtitles');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
