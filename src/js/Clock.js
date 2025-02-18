import { AlertRenderer } from './AlertRenderer';
import { sendError } from './utils';

export class Clock {
  constructor() {
    this.clock = document.querySelector('.clock');

    this.daysLeft = this.clock.querySelector('#days');
    this.hoursLeft = this.clock.querySelector('#hours');
    this.minutesLeft = this.clock.querySelector('#minutes');
    this.secondsLeft = this.clock.querySelector('#seconds');

    this.startPromotionElement = document.querySelector('#js-date-start');
    this.endPromotionElement = document.querySelector('#js-date-end');

    this.startPromotion = '';
    this.endPromotion = '';

    this.init();
  }

  init() {
    this.setPromoDate();

    setInterval(this.updateCountdown.bind(this), 1000);
    this.updateCountdown();
  }

  setPromoDate() {
    if (this.startPromotionElement.textContent === '' || this.endPromotionElement.textContent === '') {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000);
      this.startPromotionElement.textContent = startDate.toLocaleDateString();
      this.startPromotion = startDate.toLocaleDateString();

      const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      this.endPromotionElement.textContent = endDate.toLocaleDateString();
      this.endPromotion = endDate.toLocaleDateString();
    } else {
      this.startPromotion = this.startPromotionElement.textContent;
      this.endPromotion = this.endPromotionElement.textContent;
    }
  }

  getPromoEndDate() {
    const [day, month, year] = this.endPromotion.split('.');
    return new Date(`${year}-${month}-${day}T23:59:59`).getTime();
  }

  getPromoStartDate() {
    const [day, month, year] = this.startPromotion.split('.');
    return new Date(`${year}-${month}-${day}T23:59:59`).getTime();
  }

  updateCountdown() {
    const now = new Date().getTime();
    const promoEndDate = this.getPromoEndDate();

    if (now >= promoEndDate) {
      this.updatePromoDate();
    }

    const timeLeft = promoEndDate - now;
    this.daysLeft.innerText = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    this.hoursLeft.innerText = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutesLeft.innerText = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft.innerText = Math.floor((timeLeft % (1000 * 60)) / 1000);
  }

  updatePromoDate() {
    const newStartDate = new Date(this.getPromoStartDate() + 7 * 24 * 60 * 60 * 1000);
    const newEndDate = new Date(this.getPromoEndDate() + 14 * 24 * 60 * 60 * 1000);

    this.startPromotionElement.textContent = newStartDate.toLocaleDateString();
    this.endPromotionElement.textContent = newEndDate.toLocaleDateString();

    this.startPromotion = newStartDate.toLocaleDateString();
    this.endPromotion = newEndDate.toLocaleDateString();

    const text = `Оновлення дати акції з ${this.startPromotion} до ${this.endPromotion}`;
    this.sendMessageTelegram(text);
  }

  async sendMessageTelegram(text) {
    const response = await fetch(process.env.API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        disable_notification: true,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}
