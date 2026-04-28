export const Href = "#";
export const ImagePath = "/assets/images";
export const audioFile = '/assets/audio/multi-pop.mp3';
<<<<<<< HEAD
export const storageURL = process.env.storageURL;

// Returns a valid image src: absolute URLs pass through, relative ones get storageURL prepended.
export const getMediaSrc = (url, fallback = "") => {
  if (!url) return fallback;
  return /^https?:\/\//.test(url) ? url : storageURL + url;
};
=======
export const storageURL = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.storageURL || ""
>>>>>>> 073ecc6aa46337a1439684b407e3b9c79bd93edc
