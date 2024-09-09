import assert from 'assert';
import {
  extractJobRoleFilterParams,
  formatDate,
} from '../../../src/utils/JobRoleUtil';
import express from 'express';

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
    const mockRequest = {
      query: {
        roleName: 'Developer',
        jobRoleLocation: 'NYC',
        capabilityName: '1',
        bandName: '2',
        closingDate: '2023-09-01',
      },
    } as unknown as express.Request;

    const result = extractJobRoleFilterParams(mockRequest);

    assert.equal(result.roleName, 'Developer');
    assert.equal(result.jobRoleLocation, 'NYC');
    assert.equal(result.capabilityName, '1');
    assert.equal(result.bandName, '2');
    assert.equal(result.closingDate, '2023-09-01');
  });

  it('should handle missing parameters gracefully', () => {
    const mockRequest = {
      query: {
        roleName: 'Developer',
      },
    } as unknown as express.Request;

    const result = extractJobRoleFilterParams(mockRequest);

    assert.equal(result.roleName, 'Developer');
    assert.equal(result.jobRoleLocation, undefined);
    assert.equal(result.capabilityName, undefined);
    assert.equal(result.bandName, undefined);
    assert.equal(result.closingDate, undefined);
  });
});
