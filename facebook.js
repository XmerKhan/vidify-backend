import axios from "axios";
import * as cheerio from "cheerio";

export async function getFacebookVideo(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const videoUrl = $("meta[property='og:video']").attr("content");
  const imageUrl = $("meta[property='og:image']").attr("content");
  const title = $("meta[property='og:title']").attr("content");

  return {
    platform: "Facebook",
    title: title || "Facebook Video",
    thumbnail: imageUrl,
    downloadUrl: videoUrl || imageUrl,
    quality: "HD"
  };
}
