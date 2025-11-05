import express from "express";
import cors from "cors";
import { getYouTubeVideo } from "./utils/youtube.js";
import { getTikTokVideo } from "./utils/tiktok.js";
import { getInstagramVideo } from "./utils/instagram.js";
import { getFacebookVideo } from "./utils/facebook.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Video URL required" });

  try {
    let data;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      data = await getYouTubeVideo(url);
    } else if (url.includes("tiktok.com")) {
      data = await getTikTokVideo(url);
    } else if (url.includes("instagram.com")) {
      data = await getInstagramVideo(url);
    } else if (url.includes("facebook.com")) {
      data = await getFacebookVideo(url);
    } else {
      return res.status(400).json({ error: "Unsupported platform" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Vidify backend running on port ${PORT}`));
