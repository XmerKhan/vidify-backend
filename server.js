import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import ytdl from "ytdl-core";

const app = express();
app.use(cors());
app.use(express.json());

// Helper: clean URLs
function cleanUrl(url) {
  return url.split("?")[0].replace(/\/$/, "");
}

// 🌐 Auto Detect Platform
app.post("/api/detect", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "No URL provided" });

    const clean = cleanUrl(url);

    // 🎥 YouTube
    if (clean.includes("youtube.com") || clean.includes("youtu.be")) {
      const info = await ytdl.getInfo(clean);
      const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
      return res.json({
        platform: "YouTube",
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop().url,
        downloadUrl: format.url,
        quality: format.qualityLabel || "1080p",
      });
    }

    // 📸 Instagram
    if (clean.includes("instagram.com")) {
      const api = await fetch(
        `https://api.lamadava.com/v1/media?url=${encodeURIComponent(clean)}&apikey=free_public`
      );
      const data = await api.json();

      if (!data || !data.video) {
        return res.status(400).json({ error: "Failed to fetch Instagram video" });
      }

      return res.json({
        platform: "Instagram",
        title: data.caption || "Instagram Reel",
        thumbnail: data.preview || data.thumbnail || "",
        downloadUrl: data.video,
        quality: "HD",
      });
    }

    // 🎵 TikTok (no watermark)
    if (clean.includes("tiktok.com")) {
      const response = await fetch(
        `https://www.tikwm.com/api/?url=${encodeURIComponent(clean)}`
      );
      const data = await response.json();
      return res.json({
        platform: "TikTok",
        title: data.data.title,
        thumbnail: data.data.cover,
        downloadUrl: data.data.play,
        quality: "HD",
      });
    }

    // 📘 Facebook
    if (clean.includes("facebook.com")) {
      const fb = await fetch(
        `https://facebook-video-scraper.vercel.app/api?url=${encodeURIComponent(clean)}`
      );
      const data = await fb.json();
      return res.json({
        platform: "Facebook",
        title: data.title || "Facebook Video",
        thumbnail: data.thumbnail,
        downloadUrl: data.sd || data.hd,
        quality: "HD",
      });
    }

    return res.status(400).json({ error: "Unsupported platform" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 🟢 Root
app.get("/", (req, res) => {
  res.send("✅ Vidify Backend is live and working fine!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
