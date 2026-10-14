export function setTitle(title:string) {
  const head = document.head;
  let titleEl = head.querySelector('title');

  if (titleEl) {
    titleEl.textContent = title;
  } else {
    titleEl = document.createElement('title');
    titleEl.textContent = title;
    head.appendChild(titleEl);
  }
}
