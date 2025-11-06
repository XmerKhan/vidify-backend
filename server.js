import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Your RapidAPI Key and Host
const RAPIDAPI_KEY = "d7c9984414msh9a765d2ba1e12f1p192673jsn05c92d7aa150";
const RAPIDAPI_HOST = "youtube-media-downloader.p.rapidapi.com";

app.get("/api/fetch", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "URL is required" });

  try {
    // ✅ Extract YouTube video ID
    const videoIdMatch = videoUrl.match(/[?&]v=([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL" });

    // ✅ RapidAPI endpoint
    const apiUrl = `https://${RAPIDAPI_HOST}/v2/video/details?videoId=${videoId}&urlAccess=normal&videos=auto&audios=auto`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    const data = await response.json();

    if (!data || !data.videos) {
      return res.status(404).json({ error: "Video not found or API issue" });
    }

    // ✅ Extract video info
    const videoInfo = {
      title: data.title,
      thumbnail: data.thumbnail?.[0]?.url || "",
      duration: data.lengthSeconds,
      formats: data.videos,
    };

    res.json(videoInfo);
  } catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
