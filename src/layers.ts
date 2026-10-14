import { SipImage } from "./types";
import { unfocusAllImages } from "./images";

const layerTab = <HTMLDivElement>document.getElementById('layer-tab');
const layerContainer = <HTMLDivElement>layerTab.querySelector('#layer-container');
const layerOpacityValue= <HTMLInputElement>document.getElementById('layer-opacity-value');
const layerOpacityInput = <HTMLInputElement>document.getElementById('layer-opacity-input');

const moveLayerUpButton = <HTMLButtonElement>document.getElementById('move-layer-up');
const moveLayerDownButton = <HTMLButtonElement>document.getElementById('move-layer-down');

layerOpacityInput.disabled = true;
layerOpacityInput.value = '100';
layerOpacityValue.textContent = 'Opacity: 1';


function getFocusedImageIndex(images: SipImage[]) {
  if (!images) return -1;
  for (let i = 0; i < images.length; i++) {
    if (images[i].focused) return i;
  }

  return -1;
}

function moveUp(images: SipImage[]) {
  const i = getFocusedImageIndex(images);
  if (i >= images.length - 1 || i < 0) return;
  console.log(1);
  const temp = images[i + 1];
  images[i + 1] = images[i];
  images[i] = temp;

  updateLayers(images);
}

function moveDown(images: SipImage[]) {
  const i = getFocusedImageIndex(images);
  if (i < 1) return;

  const temp = images[i - 1];
  images[i - 1] = images[i];
  images[i] = temp;

  updateLayers(images);
}


export function updateLayers(images: SipImage[]) {
  
  moveLayerUpButton.onclick = () => {
    moveUp(images);
  };

  moveLayerDownButton.onclick = () => {
    console.log(123);
    moveDown(images);
  };

  layerContainer.innerHTML = '';

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const layer = document.createElement('div');
    layer.classList.add('layer');

    if (image.focused) {
      layer.classList.add('active-layer');
      layerOpacityInput.disabled = false;
      layerOpacityInput.oninput = () => {
        const value = parseInt(layerOpacityInput.value) / 100;
        layerOpacityValue.textContent = `Opacity: ${value.toFixed(2)}`;
        image.opacity = value;
      }
    }

    layer.addEventListener('click', (ev: MouseEvent) => {
      const focusedLayer = document.querySelector('.active-layer');
      if (focusedLayer) {
        focusedLayer.classList.remove('active-layer');
        
      }

      unfocusAllImages(images);

      layer.classList.add('active-layer');
      image.focused = true;

      layerOpacityInput.disabled = false;
      layerOpacityInput.value = (image.opacity * 100).toString();
      layerOpacityValue.textContent = `Opacity: ${image.opacity}`;
      layerOpacityInput.oninput = () => {
        const value = parseInt(layerOpacityInput.value) / 100;
        layerOpacityValue.textContent = `Opacity: ${value.toFixed(2)}`;
        image.opacity = value;
      }
    });

    const thumbnail = document.createElement('img');
    thumbnail.classList.add('layer-thumbnail');
    thumbnail.src = image.objectURL;
    thumbnail.alt = 'Layer thumbnail';

    const name = document.createElement('p');
    name.classList.add('layer-name');
    name.textContent = image.name;

    const visibilityButton = document.createElement('button');
    visibilityButton.classList.add('layer-button', 'layer-visibility-button');

    const visibilityIcon = document.createElement('img');
    visibilityIcon.src = image.hidden ? 
      './img/visibility_off.png' : 
      './img/visibility.png';

    visibilityButton.appendChild(visibilityIcon);
    visibilityButton.addEventListener('click', () => {
      image.hidden = !image.hidden;

      visibilityIcon.src = image.hidden ? 
      './img/visibility_off.png' : 
      './img/visibility.png';
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('layer-button', 'layer-delete-button');

    const deleteIcon = document.createElement('img');
    deleteIcon.src = image.hidden ? 
      './img/delete.png' : 
      './img/delete.png';

    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', () => {
      images.splice(i, 1);
      updateLayers(images);
    });

    layer.appendChild(thumbnail);
    layer.appendChild(name);
    layer.appendChild(visibilityButton);
    layer.appendChild(deleteButton);

    layerContainer.appendChild(layer);
  }
}