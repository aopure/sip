const colorWheelImage = <HTMLImageElement> document.getElementById('color-wheel-image');
export const colorWheelCanvas = <HTMLCanvasElement> document.getElementById('color-wheel-canvas');
const colorWheelCtx = <CanvasRenderingContext2D> colorWheelCanvas.getContext('2d');
colorWheelCanvas.width = colorWheelCanvas.clientWidth;
colorWheelCanvas.height = colorWheelCanvas.clientWidth;

colorWheelImage.onload = drawColorwheel;

let color = 'white';
let isDown = false;
let onColorChange: Function | null = null;

export function onColorChanged(fn:Function) {
  onColorChange = fn;
} 

export function resizeColorwheel() {
  colorWheelCanvas.width = parseInt(getComputedStyle(colorWheelCanvas).width);
  colorWheelCanvas.height = parseInt(getComputedStyle(colorWheelCanvas).width);
}

export function drawColorwheel() {
  colorWheelCtx.drawImage(colorWheelImage, 0, 0, colorWheelCanvas.width, colorWheelCanvas.width);
}

export function colorWheelEventHandler(ev:MouseEvent) {
  const x = ev.offsetX;
  const y = ev.offsetY;

  const imageData = colorWheelCtx.getImageData(x, y, 1, 1);

  const r = imageData.data[0];
  const g = imageData.data[0 + 1];
  const b = imageData.data[0 + 2];

  const rgb = `rgb(${r}, ${g}, ${b})`;
  
  setColor(rgb);
}

colorWheelCanvas.addEventListener('mousedown', (ev: MouseEvent) => {
  isDown = true;
  colorWheelEventHandler(ev);
});

colorWheelCanvas.addEventListener('mousemove', (ev: MouseEvent) => {
  if (!isDown) return;
  colorWheelEventHandler(ev);
});

window.addEventListener('mouseup', () => {
  isDown = false;
});

function setColor(rgb: string) {
  color = rgb;

  if (onColorChange) {
    onColorChange();
  }
}

export function getColorwheelColor() {
  return color;
}