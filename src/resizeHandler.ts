import { resizeColorwheel } from "./colorwheel";

export function handleResize() {
  const main = <HTMLDivElement> document.querySelector('main');
  const canvas = <HTMLCanvasElement> document.getElementById('sip-canvas');
  const leftSidebar = <HTMLDivElement> document.getElementById('left-sidebar');
  const rightSidebar = <HTMLDivElement> document.getElementById('right-sidebar');

  const leftWidth = parseInt(getComputedStyle(leftSidebar).width);
  const rightWidth = parseInt(getComputedStyle(rightSidebar).width);
  const screenWidth = parseInt(getComputedStyle(main).width);
  const canvasWidth = Math.floor(screenWidth - leftWidth - rightWidth);
  canvas.style.width = `${canvasWidth}px`;

  canvas.width = canvasWidth;
  canvas.height = Math.floor(canvas.clientHeight);

  resizeColorwheel();

}