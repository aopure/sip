import { SipImage } from "./types";
import { fileToImageData } from "./files";

export function unfocusAllImages(images: SipImage[]) {
  for (const image of images) {
    image.focused = false;
  }
}

export function getFocusedImage(images: SipImage[]) {
  for (const image of images) {
    if (image.focused) return image;
  }

  return null;
}

export async function addImage(file: File, images: SipImage[]) {
  const imageData = await fileToImageData(file);
  const width = imageData.width;
  const height = imageData.height;
  unfocusAllImages(images);
  const image: SipImage = {
    x: 0,
    y: 0,
    width,
    height,
    opacity: 1,
    name: file.name,
    hidden: false,
    focused: true,
    data: imageData,
    objectURL: URL.createObjectURL(file)
  }

  images.push(image);
}