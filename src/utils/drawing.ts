import { SipImage, State } from "../types";

export function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number, 
  x2: number, 
  y2: number, 
  color = 'black'
) {
  ctx.save()
  ctx.beginPath();

  ctx.strokeStyle = color;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.restore();
}

export function fillRect(
  ctx: CanvasRenderingContext2D, 
  state: State,
  x: number, 
  y: number,
  width: number,
  height: number
) {
  const zoom = state.zoom;
  const offsetX = state.offsetX * zoom;
  const offsetY = state.offsetY * zoom;
  x = state.zoomOffsetX + x * zoom + offsetX;
  y = state.zoomOffsetY + y * zoom + offsetY;
  width = width * zoom;
  height = height * zoom;
  ctx.fillRect(x, y, width, height);
}

function strokeRect(
  ctx: CanvasRenderingContext2D, 
  state: State,
  x: number, 
  y: number,
  width: number,
  height: number
) {
  const zoom = state.zoom;
  const offsetX = state.offsetX * zoom;
  const offsetY = state.offsetY * zoom;
  x = state.zoomOffsetX + x * zoom + offsetX;
  y = state.zoomOffsetY + y * zoom + offsetY;
  width = width * zoom;
  height = height * zoom;
  ctx.strokeRect(x, y, width, height);
}

function pointInRect(
  px: number, 
  py: number, 
  rx: number, 
  ry: number, 
  w: number, 
  h: number
) {

  if (
    (rx <= px && px <= (rx + w)) && 
    (ry <= py && py <= (ry + h))
  ) return true
  return false;
}

export function hoveredResizeHandler(
  ev: MouseEvent,
  state: State,
  image: SipImage
) {
  const zoom = state.zoom;
  const offsetX = state.offsetX * zoom;
  const offsetY = state.offsetY * zoom;
  const x = Math.floor(state.zoomOffsetX + image.x * zoom + offsetX);
  const y = Math.floor(state.zoomOffsetY + image.y * zoom + offsetY);
  const width  = Math.floor(image.width * zoom);
  const height = Math.floor(image.height * zoom);

  let resizeHandlerSize;

  if (width < 30 * 3) {
    resizeHandlerSize = 15;
  } else {
    resizeHandlerSize = 30;
  }

  const half = resizeHandlerSize / 2;

  const left = x;
  const right = left + width;
  const top = y;
  const bottom = top + height;
  const centerX = left + width / 2;
  const centerY = top + height / 2

  const topLeft = pointInRect(
    ev.offsetX, 
    ev.offsetY,
    left - half, 
    top - half, 
    resizeHandlerSize, 
    resizeHandlerSize
  );

  const topRight = pointInRect(
    ev.offsetX,
    ev.offsetY,
    right - half,
    top - half,
    resizeHandlerSize,
    resizeHandlerSize
  );

  const bottomRight = pointInRect(
    ev.offsetX,
    ev.offsetY,
    right - half,
    bottom - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  const bottomLeft = pointInRect(
    ev.offsetX,
    ev.offsetY,
    left - half,
    bottom - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  const topCenter = pointInRect(
    ev.offsetX,
    ev.offsetY,
    centerX - half,
    top - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  const bottomCenter = pointInRect(
    ev.offsetX,
    ev.offsetY,
    centerX - half,
    bottom - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  const centerLeft = pointInRect(
    ev.offsetX,
    ev.offsetY,
    left - half,
    centerY - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  const centerRight = pointInRect(
    ev.offsetX,
    ev.offsetY,
    right - half,
    centerY - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  const centerCenter = pointInRect(
    ev.offsetX,
    ev.offsetY,
    centerX - half,
    centerY - half,
    resizeHandlerSize,
    resizeHandlerSize,
  );

  if (topLeft)      return 'topLeft';
  if (topRight)     return 'topRight';
  if (bottomRight)  return 'bottomRight';
  if (bottomLeft)   return 'bottomLeft';
  if (topCenter)    return 'topCenter';
  if (bottomCenter) return 'bottomCenter';
  if (centerLeft)   return 'centerLeft';
  if (centerRight)  return 'centerRight';
  if (centerCenter) return 'centerCenter'

  return '';

}

function drawResizeHandlers(
  ctx: CanvasRenderingContext2D, 
  state: State,
  image: SipImage,
) {
  const zoom = state.zoom;
  const offsetX = state.offsetX * zoom;
  const offsetY = state.offsetY * zoom;
  const x = Math.floor(state.zoomOffsetX + image.x * zoom + offsetX);
  const y = Math.floor(state.zoomOffsetY + image.y * zoom + offsetY);
  const width  = Math.floor(image.width * zoom);
  const height = Math.floor(image.height * zoom);

  let resizeHandlerSize;

  if (width < 30 * 3) {
    resizeHandlerSize = 15;
  } else {
    resizeHandlerSize = 30;
  }

  const half = resizeHandlerSize / 2;

  const left = x;
  const right = left + width;
  const top = y;
  const bottom = top + height;
  const centerX = left + width / 2;
  const centerY = top + height / 2

  ctx.save();
  ctx.strokeStyle = 'white';

  // Top left
  ctx.strokeRect(
    left - half, 
    top - half, 
    resizeHandlerSize, 
    resizeHandlerSize
  );

  // Top right
  ctx.strokeRect(
    right - half,
    top - half,
    resizeHandlerSize,
    resizeHandlerSize
  );

  // Bottom right
  ctx.strokeRect(
    right - half,
    bottom - half,
    resizeHandlerSize,
    resizeHandlerSize,

  );

  // Bottom left
  ctx.strokeRect(
    left - half,
    bottom - half,
    resizeHandlerSize,
    resizeHandlerSize,

  );

  // Top center
  ctx.strokeRect(
    centerX - half,
    top - half,
    resizeHandlerSize,
    resizeHandlerSize,

  );

  // Bottom center
  ctx.strokeRect(
    centerX - half,
    bottom - half,
    resizeHandlerSize,
    resizeHandlerSize,

  );

  // Center left
  ctx.strokeRect(
    left - half,
    centerY - half,
    resizeHandlerSize,
    resizeHandlerSize,

  );

  // Center right
  ctx.strokeRect(
    right - half,
    centerY - half,
    resizeHandlerSize,
    resizeHandlerSize
  );

  // Center center (for moving)
  ctx.strokeRect(
    centerX - half,
    centerY - half,
    resizeHandlerSize,
    resizeHandlerSize
  );

  ctx.restore();
}

export function drawImage(
  ctx: CanvasRenderingContext2D, 
  state: State,
  image: SipImage,
  x: number, 
  y: number,
  width: number,
  height: number
) {
  if (image.hidden) return;
  
  const img = new Image();
  img.src = image.objectURL;
  
  const zoom = state.zoom;
  const offsetX = state.offsetX * zoom;
  const offsetY = state.offsetY * zoom;
  x = Math.floor(state.zoomOffsetX + x * zoom + offsetX);
  y = Math.floor(state.zoomOffsetY + y * zoom + offsetY);
  width  = Math.floor(width * zoom);
  height = Math.floor(height * zoom);
  
  if (state.mode !== 'resize') {
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      Math.floor(0 + offsetX + state.zoomOffsetX), 
      Math.floor(0 + offsetY + state.zoomOffsetY), 
      Math.floor(state.baseImageWidth * zoom), 
      Math.floor(state.baseImageHeight * zoom)
    );
    ctx.clip();
    ctx.globalAlpha = image.opacity;
    ctx.drawImage(img, x, y, width, height);
    ctx.closePath();
    ctx.restore();
  } else {
    ctx.save();
    ctx.globalAlpha = image.opacity;
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
  }
  
  if (image.focused) {
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.setLineDash([4]);
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
    
    if (state.mode === 'resize') {
      drawResizeHandlers(ctx, state, image);
    }
  }
  ctx.restore();
}

export function generateGridBackground() {
  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  const gap = 10;
  const gray = '#CACACA';
  
  canvas.width = gap * 2;
  canvas.height = gap * 2;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, gap, gap);
  ctx.fillRect(gap, gap, gap, gap);

  ctx.fillStyle = gray;
  ctx.fillRect(gap, 0, gap, gap);
  ctx.fillRect(0, gap, gap, gap);

  return canvas
}

export function drawGridBackground(
  ctx: CanvasRenderingContext2D,
  state: State,
  grid: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const zoom = state.zoom;
  const offsetX = state.offsetX * zoom;
  const offsetY = state.offsetY * zoom;
  x = Math.floor(state.zoomOffsetX + x * zoom + offsetX);
  y = Math.floor(state.zoomOffsetY + y * zoom + offsetY);
  width  = Math.floor(width * zoom);
  height = Math.floor(height * zoom);
  
  ctx.save();
  ctx.beginPath();
  const pattern = ctx.createPattern(grid, 'repeat');

  if (pattern) {
    pattern.setTransform(
      new DOMMatrix().translate(x, y)
    );
    ctx.fillStyle = pattern;
    ctx.fillRect(x, y, width, height);
  }

  ctx.restore();
}