export function fileToImageData(file: File): Promise<ImageData> {
  return new Promise(res => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = <CanvasRenderingContext2D> tempCanvas.getContext('2d');

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      tempCanvas.width = width;
      tempCanvas.height = height;

      tempCtx.drawImage(img, 0, 0, width, height);
      const imageData = tempCtx.getImageData(0, 0, width, height);

      tempCanvas.remove();
      res(imageData);

    }
  })
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise(res => {
    canvas.toBlob((blob) => {
      res(blob);
    })
  });
}