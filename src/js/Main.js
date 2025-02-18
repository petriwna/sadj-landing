import { Clock } from './Clock';
import { Form } from './Form';
import { ReviewsComponent } from './ReviewsComponent';

export class Main {
  constructor() {
    this.buttonAnchor = document.querySelector('.anchor');
    this.targetSection = document.querySelector('#request');

    this.init();
  }

  init() {
    this.addEventListeners();

    new Clock();
    this.initForm();
    new ReviewsComponent();
  }

  initForm() {
    const form = document.querySelector('.request__form');
    new Form(form);
  }

  addEventListeners() {
    this.buttonAnchor.addEventListener('click', this.scrollToSection.bind(this));
  }

  scrollToSection(event) {
    event.preventDefault();
    this.targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
