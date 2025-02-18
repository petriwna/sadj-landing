export function toggleBtn(btn) {
  if (window.scrollY === 0) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
  }
}

export function addClassToElement(id, className) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add(className);
  }
}

export function removeClassFromElement(id, className) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.remove(className);
  }
}

export function sendError(error, message) {
  const text = `${error}\n ${message}`;
  const url = `${process.env.API_ERROR}?chat_id=${process.env.TELEGRAM_CHAT_ID_ERROR}&text=${text}`;
  const xht = new XMLHttpRequest();
  xht.open('GET', url);
  xht.send();
}
