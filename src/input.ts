const imageInput = <HTMLInputElement>document.getElementById('image-input');

const openFileButton = <HTMLLIElement>document.getElementById('open-file-button');

openFileButton.addEventListener('click', () => {
  imageInput.click();
});

export function onImageInput(callback: Function) {
  imageInput.addEventListener('input', async (ev: InputEvent) => {
    if (!imageInput.files || imageInput.files.length !== 1) return;

    const file = imageInput.files[0];
    callback(file);

  });
}