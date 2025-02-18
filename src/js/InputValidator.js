export class InputValidator {
  static isPhoneNumber(phoneNumber) {
    const phoneRegex = /^(?:\+380\d{9}|0\d{9})$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  static isNameValid(name) {
    const nameRegex = /^[а-яёґєіїa-z\s-]{2,}$/iu;
    return nameRegex.test(name);
  }

  static isEmpty(value) {
    return !!value;
  }
}
