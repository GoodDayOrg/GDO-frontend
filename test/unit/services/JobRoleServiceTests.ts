import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { JobRoleResponse } from '../../../src/models/JobRoleResponse';
import { getAllJobRoles } from '../../../src/services/JobRoleService';
import { axiosInstance } from '../../../src/config';

const URL: string = '/api/job-roles';

const jobRoleResponse: JobRoleResponse = {
  jobRoleId: 1,
  roleName: 'delivery_master',
  jobRoleLocation: 'Buenos Aires',
  capabilityName: 'delivery',
  bandName: 'Architect',
  closingDate: new Date('10/10/2024'),
};

const mock = new MockAdapter(axiosInstance);

describe('JobRoleService', function () {
  describe('getAllJobRoles', function () {
    it('should return job roles from response', async () => {
      const data = [jobRoleResponse];

      mock.onGet(URL).reply(200, data);

      const results = await getAllJobRoles();
      results[0].closingDate = new Date(results[0].closingDate);

      expect(results[0]).to.deep.equal(jobRoleResponse);
    });

    it('should throw exception when 500 error returned from axios', async () => {
      mock.onGet(URL).reply(500);

      try {
        await getAllJobRoles();
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Failed to get job-roles');
        return;
      }
    });

    it('should throw exception when 404 error returned from axios', async () => {
      mock.onGet(URL).reply(404);

      try {
        await getAllJobRoles();
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Failed to get job-roles');
        return;
      }
    });
  });
});
