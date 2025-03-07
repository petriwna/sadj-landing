import '../scss/style.scss';

import { Main } from './Main';

export function init() {
  new Main();
}

document.addEventListener('DOMContentLoaded', init);
