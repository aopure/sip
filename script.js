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
  document.getElementById(`${m}-mode`).classList.add('active-mode')
  mode = m;
}

let focusedPictureId = -1;
let focusedPictureX = 0;
let focusedPictureY = 0;

let id = 0;
function updateLayersList() {
  layersElem.innerHTML = '';

  let i = 0;
  for(let key in images) {
    const image = images[key];
    const div = document.createElement('div');
    div.classList.add('layer');
    div.dataset.id = key;
    div.onclick = () => {focusedPictureId = +key}; 
    
    const img = document.createElement('img');
    img.src = image.url;

    const p = document.createElement('p');
    p.textContent = i === 0 ? 'Base Layer' : `Layer ${i}`;

    div.appendChild(img);
    div.appendChild(p);
    layersElem.appendChild(div);
    i++
  }
}

function addNewImage(files) {
  const img = files[0];
  createImageBitmap(img).then((map) => {
      const imageObj = {
        bitmap: map,
        url: URL.createObjectURL(img),
        x: 50,
        y: 50,
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

function rect(x, y, w, h, color, fill=true) {
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
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const ratio = width/height;

    const imageX = image.x * zoom + offsetX * zoom + activeOffsetX * zoom;
    const imageY = image.y * zoom + offsetY * zoom + activeOffsetY * zoom;
    const imageWidth = 300*ratio * zoom;
    const imageHeight = 300 * zoom;

    if(+key === focusedPictureId) {
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
    console.log(id);
    const img = imgs[i][1];
    const imgX = img.x + activeOffsetX + offsetX;
    const imgY = img.y + activeOffsetY + offsetY;
    const width = img.bitmap.width;
    const height = img.bitmap.height;
    const ratio = width/height;
    const imgW = 300 * ratio * zoom; // Hard-coded image image size for now; will change when resize feature is supported
    const imgH = 300 * zoom;
    if(imgX <= x && x <= imgX+imgW && imgY <= y && y <= imgY+imgH) {
      console.log(x, y);
      console.log(imgX, imgY, imgW, imgH);
      focusedPictureId = +id;
      break;
    }
  }
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

  if(images[focusedPictureId] && cursor.isDown) {
    const image = images[focusedPictureId];
    image.x = (ev.offsetX - cursor.downAtX + focusedPictureX*zoom)/zoom;
    image.y = (ev.offsetY - cursor.downAtY + focusedPictureY*zoom)/zoom;
  }
});

function zoomHandle(ev) {
  let oldZoom = zoom;
  zoom += ev.deltaY < 0 ? 0.15 : -0.15;
  zoom = Math.max(Math.min(15, zoom), 0.2);
  temp.x = cursor.offsetX - (cursor.offsetX - temp.x) * (zoom / oldZoom)
  temp.y = cursor.offsetY - (cursor.offsetY - temp.y) * (zoom / oldZoom)
}

canvas.addEventListener('wheel', zoomHandle);

window.addEventListener('paste', (ev) => {
  if(ev.clipboardData.files.length === 1) {
    addNewImage(ev.clipboardData.files);
  }
});