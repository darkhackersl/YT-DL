const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/details', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const details = {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            size: 'Unknown', // You can calculate size dynamically if needed
            quality_t: 'MP3 - High Quality',
            url: videoUrl,
        };

        res.status(200).send({ status: true, result: details });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error fetching video details' });
    }
});

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, ''); // Clean file name

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error processing download' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
