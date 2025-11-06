import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// ✅ YouTube Downloader Route
app.get("/api/youtube", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    // Extract YouTube video ID from the link
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    const videoId = match ? match[1] : null;
    if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

    const apiUrl = `https://youtube-video-fast-downloader-24-7.p.rapidapi.com/get-videos-info/${videoId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "youtube-video-fast-downloader-24-7.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY,
      },
    });

    const data = await response.json();
    res.json({
      success: true,
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      formats: data.adaptiveFormats || data.formats || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch YouTube video data" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ YouTube Backend is Live and Working!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
