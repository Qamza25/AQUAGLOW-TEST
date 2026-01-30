// math.mocha.test.js
const { expect } = require('chai');
const { add, multiply } = require('../math');


describe('Math functions', () => {
  it('should add 2 + 3 to equal 5', () => {
    expect(add(2, 3)).to.equal(5);
  });

  it('should multiply 2 * 3 to equal 6', () => {
    expect(multiply(2, 3)).to.equal(6);
  });
});
