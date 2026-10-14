import { handleResize } from "./resizeHandler";

const rightSidebar = <HTMLDivElement>document.getElementById('right-sidebar');
const handler = <HTMLDivElement>rightSidebar.querySelector('.resize-handler');

let isDown = false;

let downX: number;
let downY: number;
let downWidth: number;

export function handleRightSidebarResize(callback: Function) {
  handler.addEventListener('mousedown', (ev: MouseEvent) => {
    isDown = true;
    downX = ev.clientX;
    downY = ev.clientY;
    downWidth = parseInt(getComputedStyle(rightSidebar).width);
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });

  window.addEventListener('mousemove', (ev: MouseEvent) => {
    if (!isDown) return;

    const x = ev.clientX;

    const width = downWidth + downX - x;
    rightSidebar.style.width = `${width}px`;
    handleResize();
    callback();
  });
}