import { handleResize } from "./resizeHandler";

const leftSidebar = <HTMLDivElement>document.getElementById('left-sidebar');
const handler = <HTMLDivElement>leftSidebar.querySelector('.resize-handler');

let isDown = false;

let downX: number;
let downY: number;
let downWidth: number;

export function handleLeftSidebarResize(callback: Function) {
  handler.addEventListener('mousedown', (ev: MouseEvent) => {
    isDown = true;
    downX = ev.clientX;
    downY = ev.clientY;
    downWidth = parseInt(getComputedStyle(leftSidebar).width);
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });

  window.addEventListener('mousemove', (ev: MouseEvent) => {
    if (!isDown) return;

    const x = ev.clientX;

    const width = downWidth + x - downX;
    leftSidebar.style.width = `${width}px`;
    handleResize();
    callback();
  });
}