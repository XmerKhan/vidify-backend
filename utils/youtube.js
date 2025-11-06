import ytdl from "ytdl-core";

export async function getYouTubeVideo(url) {
  try {
    // 🔹 Clean the YouTube URL (remove tracking params)
    url = url.split("&")[0].split("?si")[0];

    // 🔹 Validate URL
    if (!ytdl.validateURL(url)) {
      return {
        error: true,
        message: "Invalid YouTube URL",
      };
    }

    // 🔹 Fetch info
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

    return {
      platform: "YouTube",
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      downloadUrl: format.url,
      quality: format.qualityLabel || "1080p",
    };
  } catch (err) {
    console.error("YouTube fetch error:", err);
    return {
      error: true,
      message: "Failed to fetch video info",
    };
  }
}
