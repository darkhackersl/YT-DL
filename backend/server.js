const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/details', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).send({ error: 'Missing URL parameter' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        res.send({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            size: format.contentLength ? `${(format.contentLength / (1024 * 1024)).toFixed(2)} MB` : 'Unknown',
            dl_link: format.url,
            quality: format.audioQuality,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch video details' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
