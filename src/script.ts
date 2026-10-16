import { updateLayers } from "./layers.ts";
import { SipImage, State } from "./types.ts";
import { drawColorwheel } from "./colorwheel.ts";
import { setTitle } from "./utils/setTitle.ts";
import { handleResize } from "./resizeHandler.ts";
import { handleLeftSidebarResize } from "./leftsidebar.ts";
import { handleRightSidebarResize } from "./rightsidebar.ts";
import { addImage } from "./images.ts";
import { onImageInput } from "./input.ts";
import { startRender } from "./canvas.ts";
import { addTool } from "./tools.ts";
import { flipDialogBox, removeDialogs, resizeDialogBox } from "./dialogs.ts";
import { getFocusedImage } from "./images.ts";
import { resizeImage } from "./resize.ts";

const canvas = <HTMLCanvasElement>document.getElementById('sip-canvas');
const ctx = canvas.getContext('2d');

const images: SipImage[] = [];

const state: State = {
  'isDown': false,
  'isWheelDown': false,
  'isSpaceDown': false,
  'downX': 0,
  'downY': 0,
  'offsetX': 0,
  'downOffsetX': 0,
  'cursorClientX': 0,
  'cursorClientY': 0,
  'downOffsetY': 0,
  'offsetY': 0,
  'zoom': 1,
  'zoomOffsetX': 0,
  'zoomOffsetY': 0,
  'baseImageWidth': 0,
  'baseImageHeight': 0,
  'mode': 'move',
  'resizing': '',
  'resizingWidth': null,
  'resizingHeight': null,
  'resizingX': null,
  'resizingY': null,
  'resizingStartX': null,
  'resizingStartY': null,
  'keepRatio': false,
  'resizingRatioW': 1,
  'resizingRatioH': 1,
  'horizontalFlip': true
}

function init() {

  if (ctx === null) {
    alert('Error: Your browser does not support canvas');
    return 1;
  }

  handleLeftSidebarResize(drawColorwheel);
  handleRightSidebarResize(drawColorwheel);

  let isRendering = startRender(images, state);

  onImageInput(async (file: File) => {
    await addImage(file, images);

    if (images.length === 1) {
      setTitle(`SIP | ${images[0].name}`);
    }

    if (!isRendering) isRendering = startRender(images, state);

    updateLayers(images);
  });

  window.addEventListener('resize', () => {
    handleResize();
    drawColorwheel();
  });

  addTool('move', './img/icons/move.png', () => {
    state.mode = 'move';
    canvas.style.cursor = 'move';
    removeDialogs();
  }, true);
  addTool('select', './img/icons/select.png', () => { });
  addTool('resize', './img/icons/resize.png', () => {
    state.mode = 'resize';
    canvas.style.cursor = 'default';
    const onresize = () => {
      const focusedImage = getFocusedImage(images);
      if (!focusedImage) return;

      const width = focusedImage.width;
      const height = focusedImage.height;

      state.resizingStartX = null;
      state.resizingStartY = null;

      resizeImage(focusedImage, width, height);
    }

    const onreset = () => {
      const focusedImage = getFocusedImage(images);
      if (!focusedImage) return;

      focusedImage.x = state.resizingStartX ?? 0;
      focusedImage.y = state.resizingStartY ?? 0;
      focusedImage.width = focusedImage.data.width;
      focusedImage.height = focusedImage.data.height;
      state.resizingWidth = focusedImage.data.width;
      state.resizingHeight = focusedImage.data.height;
      state.resizingRatioW = focusedImage.width / focusedImage.height;
      state.resizingRatioH = focusedImage.height / focusedImage.width;
      state.resizingX = state.resizingStartX ?? 0;
      state.resizingY = state.resizingStartY ?? 0;
      state.resizingStartX = null;
      state.resizingStartY = null;

    }
    resizeDialogBox(state, onresize, onreset);
  });
  addTool('rotate', './img/icons/rotate.png', () => { });
  addTool('flip', './img/icons/flip.png', () => {
    state.mode = 'flip';
    state.horizontalFlip = true;
    canvas.style.cursor = 'ew-resize';
    const oncheck = () => {
      if (state.horizontalFlip) {
        canvas.style.cursor = 'ew-resize';
      } else {
        canvas.style.cursor = 'ns-resize';
      }
    }
    flipDialogBox(state, oncheck);
  });
  addTool('brush', './img/icons/brush.png', () => { });
  addTool('crop', './img/icons/crop.png', () => { });
  addTool('eraser', './img/icons/eraser.png', () => { });
  addTool('colorpicker', './img/icons/colorpicker.png', () => { });

  handleResize();
  drawColorwheel();
}

init();