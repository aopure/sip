export interface SipImage {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  name: string;
  hidden: boolean;
  focused: boolean
  data: ImageData;
  objectURL: string;
}

export interface State {
  'isDown': boolean;
  'isWheelDown': boolean;
  'isSpaceDown': boolean;
  'downX': number;
  'downY': number;
  'offsetX': number;
  'downOffsetX': number;
  'downOffsetY': number;
  'cursorClientX': number;
  'cursorClientY': number;
  'offsetY': number;
  'zoom': number;
  'zoomOffsetX': number;
  'zoomOffsetY': number;
  'baseImageWidth': number;
  'baseImageHeight': number;
  'mode': string;
  'resizing': string;
  'resizingWidth': number | null;
  'resizingHeight': number | null;
  'resizingX': number | null;
  'resizingY': number | null;
  'resizingStartX': number | null;
  'resizingStartY': number | null;
  'keepRatio': boolean;
  'resizingRatioW': number;
  'resizingRatioH': number;
  'horizontalFlip': boolean;
}
