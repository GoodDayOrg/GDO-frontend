import { expect } from 'chai';
import { getHeader } from '../../../src/utils/AuthUtil';

describe('getHeader', function () {
  it('should return correct headers with given token', () => {
    const token = 'test-token';
    const result = getHeader(token);

    const expected = {
      headers: { Authorization: `Bearer ${token}` },
    };

    expect(result).to.deep.equal(expected);
  });

  it('should handle empty token', () => {
    const token = '';
    const result = getHeader(token);

    const expected = {
      headers: { Authorization: `Bearer ${token}` },
    };

    expect(result).to.deep.equal(expected);
  });

  it('should handle null token', () => {
    const token = null as unknown as string;
    const result = getHeader(token);

    const expected = {
      headers: { Authorization: `Bearer ${token}` },
    };

    expect(result).to.deep.equal(expected);
  });
});
