import axios from "axios";

export async function getTikTokVideo(url) {
  const api = `https://www.tikwm.com/api/?url=${url}`;
  const { data } = await axios.get(api);
  return {
    platform: "TikTok",
    title: data.data.title,
    thumbnail: data.data.cover,
    downloadUrl: data.data.play,
    quality: "720p/1080p"
  };
}
