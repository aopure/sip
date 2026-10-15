import { State } from "./types";

const rightSidebar = <HTMLDivElement>document.getElementById('right-sidebar');

export function removeDialogs() {
  const dialogs = document.querySelectorAll('.dialog');

  Array.from(dialogs).forEach(dialog => dialog.remove());
}


export function resizeDialogBox(state: State, onresize: Function, onreset: Function) {
  removeDialogs();
  const dialogContainer = document.createElement('div');
  dialogContainer.classList.add('dialog-resize', 'dialog');

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.gap = '10px';
  
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.addEventListener('change', () => {
    state.keepRatio = checkbox.checked;
  });
  
  const p = document.createElement('p');
  const text = document.createTextNode('Keep aspect ratio');
  p.appendChild(text);
  
  wrapper.appendChild(checkbox);
  wrapper.appendChild(p);
  dialogContainer.appendChild(wrapper);
  
  const resetBtn = document.createElement('button');
  resetBtn.addEventListener('click', () => {
    onreset();
  });
  resetBtn.textContent = 'Reset';
  dialogContainer.appendChild(resetBtn);

  const resizeBtn = document.createElement('button');
  resizeBtn.addEventListener('click', () => {
    onresize();
  });
  resizeBtn.textContent = 'Resize';
  dialogContainer.appendChild(resizeBtn);

  rightSidebar.appendChild(dialogContainer);
}

export function flipDialogBox(state: State, oncheck: Function) {
  removeDialogs();
  const dialogContainer = document.createElement('div');
  dialogContainer.classList.add('dialog', 'dialog-flip');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.checked = true;
  checkbox.addEventListener('change', () => {
    state.horizontalFlip = checkbox.checked;
    oncheck();
  });
  
  const p = document.createElement('p');
  const text = document.createTextNode('Horizontal flip');
  p.appendChild(text);
  

  dialogContainer.appendChild(checkbox);
  dialogContainer.appendChild(p);
  rightSidebar.appendChild(dialogContainer);
}