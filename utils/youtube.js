import ytdl from "ytdl-core";

export async function getYouTubeVideo(url) {
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });
  return {
    platform: "YouTube",
    title: info.videoDetails.title,
    thumbnail: info.videoDetails.thumbnails[0].url,
    downloadUrl: format.url,
    quality: format.qualityLabel || "1080p"
  };
}
