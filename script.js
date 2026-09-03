const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const addImageButtons = document.querySelectorAll('.add-image-button');
const fileInputElem = document.getElementById('image-input');
const layersElem = document.getElementById('layers');

const images = {};

const addFile = () => {
  fileInputElem.click();
};

addImageButtons.forEach( btn => {
  btn.onclick = addFile;
});

let offsetX = 0;
let offsetY = 0;
let activeOffsetX = 0;
let activeOffsetY = 0;

let zoom = 1;

const cursor = {downAtX: 0, downAtY: 0, offsetX:0, offsetY:0, isDown: false};
let temp = {x:0, y:0};
let isWheelDown = false;

let mode = 'normal';

function changeMode(m) {
  document.getElementById(`${mode}-mode`).classList.remove('active-mode');
  document.getElementById(`${m}-mode`).classList.add('active-mode');

  if(m === 'drag') {
    canvas.style.cursor = 'move';
  } else {
    canvas.style.cursor = 'default';
  }

  mode = m;
}

let focusedPictureId = -1;
let focusedPictureX = 0;
let focusedPictureY = 0;

const visibilityOn = '<span class="material-symbols-outlined">visibility</span>';
const visibilityOff = '<span class="material-symbols-outlined">visibility_off</span>';

let id = 0;
function updateLayersList() {
  layersElem.innerHTML = '';

  let i = 0;
  for(let key in images) {
    const image = images[key];
    const div = document.createElement('div');
    document.getElementsByClassName('active-layer')[0]?.classList.remove('active-layer');
    div.classList.add('layer');
    div.classList.add('active-layer');
    div.dataset.id = key;
    div.onclick = () => {focusedPictureId = +key; highLightActiveLayer()}; 
    
    const img = document.createElement('img');
    img.src = image.url;

    const p = document.createElement('p');
    p.textContent = i === 0 ? 'Base Layer' : `Layer ${i}`;

    const hideButton = document.createElement('button');
    hideButton.classList.add('hide-button');
    hideButton.onclick = () => { image.hidden = !image.hidden; updateLayersList()};
    hideButton.innerHTML = image.hidden ? visibilityOff : visibilityOn;

    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(hideButton);
    layersElem.appendChild(div);
    i++
  }
}

function highLightActiveLayer() {
  document.getElementsByClassName('active-layer')[0]?.classList.remove('active-layer');
  const layers = document.getElementsByClassName('layer');
  Array.from(layers).forEach((layer) => {
    if(+layer.dataset.id === focusedPictureId) {
      layer.classList.add('active-layer');
    }
  });
}

function addNewImage(files) {
  const img = files[0];
  createImageBitmap(img).then((map) => {
      const imageObj = {
        bitmap: map,
        url: URL.createObjectURL(img),
        x: 50,
        y: 50,
        width: map.width,
        height: map.height,
        hidden: false,
      }
      focusedPictureId = id;
      images[id] = (imageObj);
      id++;
      
      updateLayersList();
      
      document.getElementById('add-image').style.display = 'none';
      
    });
}

fileInputElem.addEventListener('change', () => {
  if(fileInputElem.files.length === 1) {
    addNewImage(fileInputElem.files);
  }
});

let W = canvas.width = Math.floor(canvas.clientWidth);
let H = canvas.height = Math.floor(canvas.clientHeight);

window.addEventListener('resize', (ev) => {
  W = canvas.width = Math.floor(canvas.clientWidth);
  H = canvas.height = Math.floor(canvas.clientHeight);
});

function rect(x, y, w, h, color, fill) {
  ctx.save();
  if(fill) {
    ctx.fillStyle = color;
  }else {
    ctx.strokeStyle = color;
  }
  ctx.rect(x, y, w, h);
  fill ? ctx.fill() : ctx.stroke();
  ctx.restore();
}

function draw() {
  ctx.reset();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(temp.x, temp.y);
  
    for(let key in images) {
    const image = images[key];
    if (image.hidden) continue; 
    const width = image.width;
    const height = image.height;
    const ratio = width/height;

    const imageX = image.x * zoom + offsetX * zoom + activeOffsetX * zoom;
    const imageY = image.y * zoom + offsetY * zoom + activeOffsetY * zoom;
    const imageWidth = width * zoom;
    const imageHeight = height * zoom;

    if(+key === focusedPictureId) {
      if(mode === 'resize') {
        rect(imageX - 15, imageY - 15, 10, 10, 'rebeccapurple', true);
        rect(imageX+imageWidth+5, imageY - 15, 10, 10, 'rebeccapurple', true);
        rect(imageX - 15, imageY + imageHeight + 5, 10, 10, 'rebeccapurple', true);
        rect(imageX+imageWidth+5, imageY + imageHeight + 5, 10, 10, 'rebeccapurple', true);

        rect( imageX + imageWidth/2 - 5, imageY - 15, 10, 10, 'rebeccapurple', true);
        rect( imageX + imageWidth/2 - 5, imageY + imageHeight + 5, 10, 10, 'rebeccapurple', true);
        rect( imageX - 15, imageY + imageHeight/2 - 5, 10, 10, 'rebeccapurple', true);
        rect( imageX+imageWidth+5, imageY + imageHeight/2 - 5, 10, 10, 'rebeccapurple', true);
      }
      rect(imageX - 10, imageY - 10, imageWidth+20, imageHeight+20, 'rebeccapurple', false);
    }

    ctx.drawImage(
      image.bitmap, 
      Math.floor(imageX), Math.floor(imageY), 
      Math.floor(imageWidth), Math.floor(imageHeight)
    );
    
  }
  
  requestAnimationFrame(draw);
}

draw();

function focusImageUnderCursor(x, y) {
  const imgs = Object.entries(images);

  focusedPictureId = -1;

  for(let i=imgs.length-1; i>=0; i--) {
    const id = imgs[i][0];
    const img = imgs[i][1];

    const imgX = temp.x + img.x * zoom + activeOffsetX * zoom + offsetX * zoom;
    const imgY = temp.y + img.y * zoom + activeOffsetY * zoom + offsetY * zoom;

    const width = img.width;
    const height = img.height;
    const ratio = width/height;
    const imgW = width * zoom; // Hard-coded image image size for now; will change when resize feature is supported
    const imgH = height * zoom;
    
    if(imgX <= x && x <= imgX+imgW && imgY <= y && y <= imgY+imgH) {
      focusedPictureId = +id;
      break;
    }
  }
  
  highLightActiveLayer();
}

function coordsInsideRect(x, y, rect) {
  const insideX = rect[0] <= x && x <= (rect[0] + rect[2]);
  const insideY = rect[1] <= y && y <= (rect[1] + rect[3]);
  
  return insideX && insideY;
}

let canResizeX = false;
let canResizeY = false;

let resizeTop = false
let resizeRight = false

function isHoveringResizeHandler(x, y) {
  const image = images[focusedPictureId];
  if(!images[focusedPictureId]) return false;

  const width = image.width;
  const height = image.height;
  const ratio = width/height;

  const imageX = temp.x + image.x * zoom + offsetX * zoom + activeOffsetX * zoom;
  const imageY = temp.y + image.y * zoom + offsetY * zoom + activeOffsetY * zoom;
  const imageWidth = width * zoom;
  const imageHeight = height * zoom;

  const handlers = [
    [imageX - 15, imageY - 15, 10, 10],
    [imageX+imageWidth+5, imageY - 15, 10, 10],
    [imageX - 15, imageY + imageHeight + 5, 10, 10],
    [imageX+imageWidth+5, imageY + imageHeight + 5, 10, 10],
    [imageX + imageWidth/2 - 5, imageY - 15, 10, 10],
    [imageX + imageWidth/2 - 5, imageY + imageHeight + 5, 10, 10],
    [imageX - 15, imageY + imageHeight/2 - 5, 10, 10],
    [imageX+imageWidth+5, imageY + imageHeight/2 - 5, 10, 10],
  ]

  for(let i = 0; i < handlers.length; i++) {
    const res = coordsInsideRect(x, y, handlers[i]);

    if (res) {
      canResizeX = i === 0 || i === 1 || i === 2 || i === 3 || i === 6 || i === 7;
      canResizeY = i === 0 || i === 1 || i === 2 || i === 3 || i === 4 || i === 5;

      resizeTop = i === 0 || i === 1 || i === 4;
      resizeRight = i === 1 || i === 3 || i === 7;
    };
  }

  return false;

}

canvas.addEventListener('mousedown', (ev) => {
  cursor.downAtX = ev.offsetX;
  cursor.downAtY = ev.offsetY;
  if(ev.button === 1) {
    isWheelDown = true;
  } else if(ev.button === 0) {
    cursor.isDown = true;
    if(mode === 'normal') {
      focusImageUnderCursor(ev.offsetX, ev.offsetY);
    } else if(mode === 'resize') {
      isHoveringResizeHandler(ev.offsetX, ev.offsetY);
    }
    focusedPictureX = images[focusedPictureId]?.x;
    focusedPictureY = images[focusedPictureId]?.y;
  }
});

window.addEventListener('mouseup', (ev) => {
  if(ev.button === 1) {
    isWheelDown = false;
  } else if(ev.button === 0) {
    cursor.isDown = false;
    focusedPictureX = 0;
    focusedPictureY = 0;

    canResizeX = false;
    canResizeY= false;
    resizeTop = false;
    resizeRight = false;
  }

  offsetX += activeOffsetX;
  activeOffsetX = 0;
  offsetY += activeOffsetY;
  activeOffsetY = 0;
});

window.addEventListener('mousemove', (ev) => {
  cursor.offsetX = ev.offsetX;
  cursor.offsetY = ev.offsetY;
  if(isWheelDown) {
    activeOffsetX = (ev.offsetX - cursor.downAtX)/zoom;
    activeOffsetY = (ev.offsetY - cursor.downAtY)/zoom;
    return;
  }

  if(cursor.isDown && mode === 'resize' && (canResizeX || canResizeY)) {
    const image = images[focusedPictureId];
    if(!image) return;

    let imageX = temp.x + image.x * zoom + offsetX * zoom + activeOffsetX * zoom;
    const imageY = temp.y + image.y * zoom + offsetY * zoom + activeOffsetY * zoom;

    if(resizeRight && canResizeX) {
      const newWidth = (ev.offsetX  - imageX - 10) / zoom;
      image.width = newWidth > 0 ? newWidth : 0;
    }

    if(!resizeRight && canResizeX) {
      const newWidth = image.width - (ev.offsetX - imageX + 10) / zoom;
      image.width = newWidth > 0 ? newWidth : 0;
      
      image.x = (ev.offsetX+10 - temp.x - activeOffsetX * zoom - offsetX * zoom)/zoom; 
      
    }

    if(!resizeTop && canResizeY) {
      const newHeight = (ev.offsetY  - imageY - 10) / zoom;
      image.height = newHeight > 0 ? newHeight : 0;
    }

    if(resizeTop && canResizeY) {
      const newHeight = image.height - (ev.offsetY - imageY + 10) / zoom;
      image.height = newHeight > 0 ? newHeight : 0;
      
      image.y = (ev.offsetY+10 - temp.y - activeOffsetY * zoom - offsetY * zoom)/zoom; 
      
    }

    return;
  }

  if(images[focusedPictureId] && cursor.isDown) {
    const image = images[focusedPictureId];
    image.x = (ev.offsetX - cursor.downAtX + focusedPictureX*zoom)/zoom;
    image.y = (ev.offsetY - cursor.downAtY + focusedPictureY*zoom)/zoom;
  }
});

function zoomHandle(ev) {
  let oldZoom = zoom;
  zoom += ev.deltaY < 0 ? 0.15 : -0.15;
  zoom = Math.max(Math.min(15, zoom), 0.05);
  temp.x = cursor.offsetX - (cursor.offsetX - temp.x) * (zoom / oldZoom)
  temp.y = cursor.offsetY - (cursor.offsetY - temp.y) * (zoom / oldZoom)
}

canvas.addEventListener('wheel', zoomHandle);

window.addEventListener('paste', (ev) => {
  if(ev.clipboardData.files.length === 1) {
    addNewImage(ev.clipboardData.files);
  }
});