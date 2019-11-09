
export class Arrays {

  static areEqual<T>(a: T[], b: T[]): boolean {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

}
