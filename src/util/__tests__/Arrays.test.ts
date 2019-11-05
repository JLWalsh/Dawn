import {Arrays} from "@util/Arrays";

describe('Arrays', () => {

  describe('given the same array', () => {
    it('should be equal', () => {
      const array = [1, 2, 3, 4];

      expect(Arrays.areEqual(array, array)).toBeTruthy();
    });
  });

  describe('given two arrays with the same values', () => {
    it('should be equal', () => {
      const array = [3, 4, 2, 1];
      const other = [3, 4, 2, 1];

      expect(Arrays.areEqual(array, other)).toBeTruthy();
    });
  });

  describe('given two arrays with different values', () => {
    it('should not be equal', () => {
      const array = [5, 4, 2, 1];
      const other = [3, 4, 2, 1];

      expect(Arrays.areEqual(array, other)).toBeFalsy();
    });
  });

  describe('given two arrays of different size', () => {
    const array = [5, 4, 2, 1];
    const other = [2, 1];

    expect(Arrays.areEqual(array, other)).toBeFalsy();
  });
});
