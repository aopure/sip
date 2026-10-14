import { canvasToBlob } from "./files";
import { SipImage } from "./types";

export async function resizeImage(image: SipImage, width: number, height: number) {
  const canvas = document.createElement('canvas');
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  const img = new Image(width, height);
  img.src = image.objectURL;
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  image.data = imageData;
  const blob = await canvasToBlob(canvas);
  if (!blob) return;
  const objectURL = URL.createObjectURL(blob);
  image.objectURL = objectURL;
}