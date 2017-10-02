const chai = require('chai');
const utils = require('../../../app/lib/utils');

const expect = chai.expect;

describe('utils', () => {
  describe('deepClone', () => {
    it('should clone value properties', () => {
      const objToClone = { a: 'a' };

      const clone = utils.deepClone(objToClone);

      expect(clone).to.deep.equal(objToClone);

      clone.a = 'new value';
      expect(clone).to.not.deep.equal(objToClone);
    });

    it('should clone object properties', () => {
      const objToClone = { a: { b: 'b' } };

      const clone = utils.deepClone(objToClone);

      expect(clone).to.deep.equal(objToClone);

      clone.a = 'new value';
      expect(clone).to.not.deep.equal(objToClone);
    });
  });

  describe('dedupeByKey', () => {
    it('should remove values with duplicate keys', () => {
      const array = [
        { name: 'one', desc: 'first one' },
        { name: 'two', desc: 'first two' },
        { name: 'one', desc: 'second one' },
        { name: 'two', desc: 'second two' },
        { name: 'three', desc: 'three' },
      ];
      const depudeArray = utils.deduplicateByKey(array, 'name');
      expect(depudeArray.length).to.equal(3);
    });
  });
});
