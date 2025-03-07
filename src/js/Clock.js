export class Clock {
  constructor() {
    this.clock = document.querySelector('.clock');
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
    const currentDate = new Date();
    const startDate = new Date(currentDate.setHours(0, 0, 0, 0)); // Встановлюємо початок акції на сьогодні
    this.startPromotionElement.textContent = startDate.toLocaleDateString('uk-UA');
    this.startPromotion = startDate.toLocaleDateString('uk-UA');

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Закінчення акції наступного дня
    this.endPromotionElement.textContent = endDate.toLocaleDateString('uk-UA');
    this.endPromotion = endDate.toLocaleDateString('uk-UA');
  }

  getPromoEndDate() {
    const [day, month, year] = this.endPromotion.split('.');
    return new Date(`${year}-${month}-${day}T23:59:59`).getTime();
  }

  getPromoStartDate() {
    const [day, month, year] = this.startPromotion.split('.');
    return new Date(`${year}-${month}-${day}T00:00:00`).getTime();
  }

  updateCountdown() {
    const now = new Date().getTime();
    const promoEndDate = this.getPromoEndDate();

    if (now >= promoEndDate) {
      this.updatePromoDate();
    }

    const timeLeft = promoEndDate - now;
    this.hoursLeft.innerText = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutesLeft.innerText = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft.innerText = Math.floor((timeLeft % (1000 * 60)) / 1000);
  }

  updatePromoDate() {
    const newStartDate = new Date(this.getPromoStartDate() + 1 * 24 * 60 * 60 * 1000); // Новий старт акції
    const newEndDate = new Date(newStartDate.getTime() + 1 * 24 * 60 * 60 * 1000); // Новий кінець акції

    this.startPromotionElement.textContent = newStartDate.toLocaleDateString('uk-UA');
    this.endPromotionElement.textContent = newEndDate.toLocaleDateString('uk-UA');

    this.startPromotion = newStartDate.toLocaleDateString('uk-UA');
    this.endPromotion = newEndDate.toLocaleDateString('uk-UA');

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
