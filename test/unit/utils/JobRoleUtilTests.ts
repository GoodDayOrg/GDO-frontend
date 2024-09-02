import assert from 'assert';
import { extractJobRoleFilterParams, formatDate } from '../../../src/utils/JobRoleUtil';

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

describe('extractJobRoleFilterParams', () => {
  it('should correctly extract filter parameters from request query', () => {
    const mockRequest: Partial<Request> = {
      query: {
        roleName: 'Developer',
        jobRoleLocation: 'NYC',
        capabilityId: '1',
        bandId: '2',
        closingDate: '2023-09-01',
      },
    };

    const result = extractJobRoleFilterParams(mockRequest);

    assert.equal(result.roleName, 'Developer');
    assert.equal(result.jobRoleLocation, 'NYC');
    assert.equal(result.capabilityId, 1);
    assert.equal(result.bandId, 2);
    assert.equal(result.closingDate, '2023-09-01');
  });

  it('should handle missing parameters gracefully', () => {
    const mockRequest = {
      query: {
        roleName: 'Developer',
      },
    } as unknown as Request;

    const result = extractJobRoleFilterParams(mockRequest);

    assert.equal(result.roleName, 'Developer');
    assert.equal(result.jobRoleLocation, undefined);
    assert.equal(result.capabilityId, undefined);
    assert.equal(result.bandId, undefined);
    assert.equal(result.closingDate, undefined);
  });

  it('should convert numeric strings to numbers', () => {
    const mockRequest = {
      query: {
        capabilityId: '5',
        bandId: '10',
      },
    } as unknown as Request;

    const result = extractJobRoleFilterParams(mockRequest);

    assert.equal(result.capabilityId, 5);
    assert.equal(result.bandId, 10);
  });

  it('should return undefined for invalid number conversions', () => {
    const mockRequest = {
      query: {
        capabilityId: 'not-a-number',
      },
    } as unknown as Request;

    const result = extractJobRoleFilterParams(mockRequest);

    assert.equal(result.capabilityId, undefined);
  });
});