export class ReviewsComponent {
  constructor() {
    this.initSlider();
  }

  initSlider() {
    // eslint-disable-next-line no-undef
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.pagination',
        bulletClass: 'pagination__button',
        bulletActiveClass: 'pagination__button--active',
      },
      navigation: {
        nextEl: '.carousel-button.next',
        prevEl: '.carousel-button.prev',
      },
    });
  }
}
