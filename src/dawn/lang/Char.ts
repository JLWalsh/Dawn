
export class Char {

  static isAlpha(char: string) {
    // TODO figure out if other alphabets are supported (chinese, japanese, arabic, ...)
    return char.toLowerCase() != char.toUpperCase();
  }

  static isNumber(char: string) {
    return '0' <= char && char <= '9';
  }
}
