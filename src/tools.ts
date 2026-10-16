const toolsContainer = <HTMLDivElement>document.querySelector('.tools-container');

export function addTool(name: string, icon: string, callback: Function, active: boolean = false) {
  const button = document.createElement('button');
  button.classList.add('tool-button');
  button.title = name;

  if (active) {
    const prevActiveTool = <HTMLButtonElement>document.querySelector('.active-tool-button');
    prevActiveTool?.classList.remove('active-tool-button');
    button.classList.add('active-tool-button');
  }

  button.addEventListener('click', () => {
    callback();
    const prevActiveTool = <HTMLButtonElement>document.querySelector('.active-tool-button');
    prevActiveTool?.classList.remove('active-tool-button');
    button.classList.add('active-tool-button');
  });

  const img = document.createElement('img');
  img.src = icon;
  img.alt = name;


  button.appendChild(img);
  toolsContainer.appendChild(button);
}