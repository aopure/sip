import { getFocusedImage } from "./images";
import { SipImage, State } from "./types";
import { generateGridBackground, drawImage, fillRect, drawGridBackground, hoveredResizeHandler } from "./utils/drawing";

const canvas = <HTMLCanvasElement> document.getElementById('sip-canvas');
const ctx = canvas.getContext('2d');

let imgs: SipImage[] = [];

let state: State;

let imageStartMoveX: number | undefined;
let imageStartMoveY: number | undefined;

let gridBackground: HTMLCanvasElement;

function render(ctx: CanvasRenderingContext2D) {
  requestAnimationFrame(() => {render(ctx)});
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  
  drawGridBackground(ctx, state, gridBackground, 0, 0, state.baseImageWidth, state.baseImageHeight);

  for (let i = 0; i < imgs.length; i++) {
    const image = imgs[i];
    const {x, y, width, height} = image;

    drawImage(ctx, state, image, x, y, width, height);
  }
}

export function startRender(images: SipImage[], st: State) {
  state = st;
  if (ctx === null || images.length === 0) return false;
  imgs = images;
  
  state.baseImageWidth = images[0].width;
  state.baseImageHeight = images[0].height;

  gridBackground = generateGridBackground();
  render(ctx);

  return true;
}

canvas.addEventListener('mousedown', (ev: MouseEvent) => {
  if (ev.button === 1) {
    state.isWheelDown = true;
    state.downX = ev.clientX;
    state.downY = ev.clientY;
    state.downOffsetX = state.offsetX;
    state.downOffsetY = state.offsetY;
  } else if (ev.button === 0) {
    state.isDown = true;
    state.downX = ev.clientX;
    state.downY = ev.clientY;
    state.downOffsetX = state.offsetX;
    state.downOffsetY = state.offsetY;

    const focusedImage = getFocusedImage(imgs);
    if (focusedImage) {
      state.resizing = hoveredResizeHandler(ev, state, focusedImage);
      state.resizingX = focusedImage.x;
      state.resizingY = focusedImage.y;
      state.resizingRatioW = focusedImage.width / focusedImage.height;
      state.resizingRatioH = focusedImage.height / focusedImage.width;
      if (state.resizingStartX != null && state.resizingStartY != null) {
        state.resizingStartX = focusedImage.x;
        state.resizingStartY = focusedImage.y;
      }
    }
  }
});

window.addEventListener('mouseup', (ev: MouseEvent) => {
  if (ev.button === 1) {
    state.isWheelDown = false;
  } else if (ev.button === 0) {
    state.isDown = false;
    imageStartMoveX = undefined;
    imageStartMoveY = undefined;
    state.resizing = '';
    const img = getFocusedImage(imgs);
    if(img) {
      state.resizingWidth = img.width;
      state.resizingHeight = img.height;
      state.resizingX = img.x;
      state.resizingY = img.y;
    }
  }
});

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (ev.key === ' ') {
    state.isSpaceDown = true;
    console.log('space down');
    state.downX = state.cursorClientX;
    state.downY = state.cursorClientY;
    state.downOffsetX = state.offsetX;
    state.downOffsetY = state.offsetY;
  }
});

window.addEventListener('keyup', (ev: KeyboardEvent) => {
  if (ev.key === ' ') {
    state.isSpaceDown = false; 
  }
});

function resizeRight(focusedImage: SipImage, ev: MouseEvent) {
  state.resizingWidth = state.resizingWidth ?? focusedImage.data.width;
  state.resizingHeight = state.resizingHeight ?? focusedImage.data.height;
  state.resizingY ??= focusedImage.y;
  if (state.resizing == 'centerRight' || !state.keepRatio) {
      const newWidth = state.resizingWidth  + (ev.clientX - state.downX) / state.zoom;
      if (newWidth >= 0) {
        focusedImage.width = newWidth;
      } else {
        focusedImage.width = 0;
      }

      if (!state.keepRatio) return;
      const ratio = state.resizingRatioH;

      const prevHeight = focusedImage.height;
      focusedImage.height = focusedImage.width * ratio;

      focusedImage.y = state.resizingY + (prevHeight - focusedImage.height) / 2;
      state.resizingY = focusedImage.y; 

  } else {
    const m = (state.resizing === 'topRight' ? -1 : 1);
    const dx = (ev.clientX - state.downX) / state.zoom;
    const dy = (ev.clientY - state.downY) / state.zoom * m;
    const ratio = state.resizingRatioW; // width / height

    const delta = (dx * ratio + dy) / (ratio * ratio + 1);
    
    const newHeight = Math.max(0, state.resizingHeight + delta);
    
    const prevHeight = focusedImage.height;
    focusedImage.height = newHeight;
    focusedImage.width = (newHeight * state.resizingRatioW);
    if (state.resizing != 'topRight') return; 
    focusedImage.y = state.resizingY + (prevHeight - focusedImage.height);
    state.resizingY = focusedImage.y; 
  }
}

function resizeBottom(focusedImage: SipImage, ev: MouseEvent) {
  state.resizingHeight = state.resizingHeight ?? focusedImage.height;
  state.resizingX ??= focusedImage.x;
    const newHeight = state.resizingHeight  + (ev.clientY - state.downY) / state.zoom;
    if (newHeight >= 0) {
      focusedImage.height = newHeight;
    } else {
      focusedImage.height = 0;
    }

  const ratio = state.resizingRatioW;
  if (state.keepRatio) {
    const prevWidth = focusedImage.width;
    focusedImage.width = focusedImage.height * ratio;
    
    if (state.resizing === 'bottomCenter') {
      console.log(state.resizingX);
      focusedImage.x = state.resizingX + (prevWidth - focusedImage.width) / 2;
      state.resizingX = focusedImage.x;
    }
  }
}

function resizeLeft(focusedImage: SipImage, ev: MouseEvent) {
  state.resizingWidth = state.resizingWidth ?? focusedImage.data.width;
  state.resizingHeight = state.resizingHeight?? focusedImage.data.height;
  state.resizingX = state.resizingX ?? focusedImage.x;
  state.resizingY = state.resizingY ?? focusedImage.y;
  if (state.resizing == 'centerLeft' || !state.keepRatio) {
      const newWidth = state.resizingWidth + (state.downX - ev.clientX) / state.zoom;
      if (newWidth >= 0) {
        focusedImage.width = newWidth;
        focusedImage.x = state.resizingX + (ev.clientX - state.downX) / state.zoom; 
      } else {
        focusedImage.width = 0;
      }

    if (!state.keepRatio) return;
    const ratio = state.resizingRatioH;
    const prevHeight = focusedImage.height;
    focusedImage.height = focusedImage.width * ratio 
    focusedImage.y = state.resizingY + (prevHeight - focusedImage.height) / 2;
    state.resizingY = focusedImage.y;
  } else {
    const m = (state.resizing === 'topLeft' ? -1 : 1);
    const dx = (state.downX - ev.clientX) / state.zoom;
    const dy = (ev.clientY - state.downY) / state.zoom * m;
    const ratio = state.resizingRatioW; // width / height

    const delta = (dx * ratio + dy) / (ratio * ratio + 1);
    
    const newHeight = Math.max(0, state.resizingHeight + delta);
    
    const prevWidth = focusedImage.width;
    const prevHeight = focusedImage.height;
    focusedImage.height = newHeight;
    focusedImage.width = (newHeight * state.resizingRatioW);
    
    focusedImage.x = state.resizingX + (prevWidth - focusedImage.width);
    state.resizingX = focusedImage.x;
    
    if (state.resizing != 'topLeft') return;
    focusedImage.y = state.resizingY + (prevHeight - focusedImage.height);
    state.resizingY = focusedImage.y; 
  }
}

function resizeTop(focusedImage: SipImage, ev: MouseEvent) {
  state.resizingHeight = state.resizingHeight ?? focusedImage.data.height;
  state.resizingWidth= state.resizingWidth ?? focusedImage.data.width;
  state.resizingX = state.resizingX ?? focusedImage.x;
  state.resizingY = state.resizingY ?? focusedImage.y;
    const newHeight = state.resizingHeight + (state.downY - ev.clientY) / state.zoom;
    if (newHeight >= 0) {
      focusedImage.height = newHeight;
      focusedImage.y = state.resizingY + (ev.clientY - state.downY) / state.zoom; 
    } else {
      focusedImage.height = 0;
    }

    if (!state.keepRatio) return;

    const ratio = state.resizingRatioW;
    const prevWidth = focusedImage.width;
    focusedImage.width = focusedImage.height * ratio;
    focusedImage.x = state.resizingX + (prevWidth - focusedImage.width) / 2;
    state.resizingX = focusedImage.x;
}

window.addEventListener('mousemove', (ev: MouseEvent) => {
  state.cursorClientX = ev.clientX;
  state.cursorClientY = ev.clientY;

  const focusedImage = getFocusedImage(imgs);

  if (state.isWheelDown || state.isSpaceDown) {
    state.offsetX = state.downOffsetX + (ev.clientX - state.downX) / state.zoom;
    state.offsetY = state.downOffsetY + (ev.clientY - state.downY) / state.zoom;
  } else if (
    focusedImage && 
    state.isDown && 
    (state.mode === 'move' || state.resizing == 'centerCenter')
  ) {
    if (imageStartMoveX === undefined || imageStartMoveY === undefined) {
      imageStartMoveX = focusedImage.x;
      imageStartMoveY = focusedImage.y;
    }

    focusedImage.x = imageStartMoveX + (ev.clientX - state.downX) / state.zoom;
    focusedImage.y = imageStartMoveY + (ev.clientY - state.downY) / state.zoom;
  } else if (focusedImage && state.resizing !== '') {

    if (state.resizing === 'topCenter') {
      resizeTop(focusedImage, ev);
    }

    if (state.resizing === 'topRight') {
      resizeRight(focusedImage, ev);
      if (state.keepRatio) return;
      resizeTop(focusedImage, ev);
    }

    if (state.resizing === 'centerRight') {
      resizeRight(focusedImage, ev);
      return;
    }

    if (state.resizing === 'bottomRight') {
      resizeRight(focusedImage, ev);
      if (state.keepRatio) return;
      resizeBottom(focusedImage, ev);
      return;
    }

    if (state.resizing === 'bottomCenter') {
      resizeBottom(focusedImage, ev);
      return;
    }

    if (state.resizing === 'bottomLeft') {
      resizeLeft(focusedImage, ev);
      if (state.keepRatio) return;
      resizeBottom(focusedImage, ev);
    }

    if (state.resizing === 'centerLeft') {
      resizeLeft(focusedImage, ev);
    }

    if (state.resizing === 'topLeft') {
      resizeLeft(focusedImage, ev);
      if (state.keepRatio) return;
      resizeTop(focusedImage, ev);
    }
  }
});

canvas.addEventListener('wheel', (ev: WheelEvent) => {
  const oldZoom = state.zoom;

  const d = 0.10;
  
  state.zoom += ev.deltaY < 0 ? (d) * state.zoom : (-d) * state.zoom;
  state.zoomOffsetX = ev.offsetX - (ev.offsetX - state.zoomOffsetX) * (state.zoom / oldZoom);
  state.zoomOffsetY = ev.offsetY - (ev.offsetY - state.zoomOffsetY) * (state.zoom / oldZoom);
});