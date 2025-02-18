export class AlertRenderer {
  static createAlert(type, text) {
    const notificationBox = document.querySelector('main');

    const component = document.createElement('div');
    component.className = 'alert show';
    component.innerHTML = `
      <div class="alert__box">
        <div class="alert__title">
          <div class="alert__${type}"></div>
          <p class='alert__text ${type} bolt'>${text}</p>
        </div>
        <p class='alert__text--second'>
        ${type === 'ok' ? 'Ми успішно її отримали та скоро зв’яжемося з вами.' : ''}
      </p>
      </div>
    `;

    notificationBox.appendChild(component);

    requestAnimationFrame(() => {
      component.classList.add('show');
    });

    setTimeout(() => {
      component.classList.add('hide');
    }, 2000);

    setTimeout(() => {
      component.remove();
    }, 2500);
  }
}
