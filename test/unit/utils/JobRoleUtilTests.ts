import assert from 'assert';
import { formatDate } from '../../../src/utils/JobRoleUtil';

describe('Format Date to LocalDateString', () => {
  it('should return localDateString when valid date provided', () => {
    const resultDate = formatDate(new Date('2024-10-15'));
    assert.equal(resultDate, '15.10.2024');
  });
  it('should return N/A when no date provided', () => {
    const resultDate = formatDate();
    assert.equal(resultDate, 'N/A');
  });
});
