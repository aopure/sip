import { canvasToBlob } from "./files";
import { SipImage, State } from "./types";

export async function flipImage(image: SipImage, state: State) {
  const canvas = document.createElement('canvas');
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  const width = image.width;
  const height = image.height;

  canvas.width = width;
  canvas.height = height;

  const img = new Image(width, height);
  img.src = image.objectURL;

  ctx.save();
  if (state.horizontalFlip) {
    ctx.scale(-1, 1);
    ctx.drawImage(img, -width, 0, width, height);
  } else {
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, -height, width, height);
  }

  ctx.restore();
  const imageData = ctx.getImageData(0, 0, width, height);
  image.data = imageData;
  const blob = await canvasToBlob(canvas);
  if (!blob) return;
  const objectURL = URL.createObjectURL(blob);
  image.objectURL = objectURL;
}