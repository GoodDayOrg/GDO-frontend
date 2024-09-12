import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { JobRoleResponse } from '../../../src/models/JobRoleResponse';
import {
  getAllJobRoles,
  getFilteredJobRoles,
  getJobRoleById,
  postApplyFileForm,
  getMyAllApplications,
  postBulkImportJobRoles,
} from '../../../src/services/JobRoleService';
import { axiosInstance } from '../../../src/config';
import { JobRoleDetailsResponse } from '../../../src/models/JobRoleDetailsResponse';
import { JobRoleFilterParams } from '../../../src/models/JobRoleFilterParams';
import { MyApplicationsResponse } from '../../../src/models/MyApplicationsResponse';
import { Readable } from 'stream';

const URL: string = '/api/job-roles';

const jobRoleResponse: JobRoleResponse = {
  jobRoleId: 1,
  roleName: 'delivery_master',
  jobRoleLocation: 'Buenos Aires',
  capabilityName: 'delivery',
  bandName: 'Architect',
  closingDate: new Date('10/10/2024'),
  statusName: 'open',
};

const jobRoleDetailsResponse: JobRoleDetailsResponse = {
  jobRoleId: 1,
  roleName: 'Tester',
  jobRoleLocation: 'Helsinki',
  capabilityName: 'Business Development & Marketing',
  bandName: 'Apprentice',
  closingDate: new Date('10/10/2024'),
  statusName: 'open',
  description:
    'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.',
  responsibilities:
    'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo.',
  sharepointUrl: 'https://cdc.gov/metus/sapien/ut/nunc/vestibulum.js',
  numberOfOpenPositions: 3,
};

const myApplicationsResponse: MyApplicationsResponse = {
  jobRoleId: 1,
  roleName: 'Tester',
  statusApplicationName: 'hired',
};

const mockMulterFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n%...', 'utf-8'),
  size: 2048,
  stream: Readable.from(Buffer.from('%PDF-1.4\n%...')),
  destination: '/uploads/',
  filename: 'test.pdf',
  path: '/uploads/test.pdf',
};

const mockMulterFileCSV: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  buffer: Buffer.from('%CSV-1.4\n%...', 'utf-8'),
  size: 2048,
  stream: Readable.from(Buffer.from('%CSV-1.4\n%...')),
  destination: '/uploads/',
  filename: 'test.csv',
  path: '/uploads/test.csv',
};

let mock: MockAdapter;

const errorMessage = 'Failed to get job role details.';

describe('JobRoleService', function () {
  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });
  afterEach(() => {
    mock.reset();
  });
  describe('getAllJobRoles', function () {
    it('should return job roles from response', async () => {
      const data = [jobRoleResponse];

      mock.onGet(URL).reply(200, data);

      const results = await getAllJobRoles('token');
      results[0].closingDate = new Date(results[0].closingDate);

      expect(results[0]).to.deep.equal(jobRoleResponse);
    });

    it('should throw exception when 500 error returned from axios', async () => {
      mock.onGet(URL).reply(500);

      try {
        await getAllJobRoles('token');
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Currently no job-roles available');
        return;
      }
    });

    it('should throw exception when 404 error returned from axios', async () => {
      mock.onGet(URL).reply(404);

      try {
        await getAllJobRoles('token');
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Currently no job-roles available');
        return;
      }
    });
  });

  describe('getFilteredJobRoles', function () {
    it('should return filtered job roles from response', async () => {
      const data = [jobRoleResponse];

      mock.onGet(URL + '/filter').reply(200, data);

      const filterParams: JobRoleFilterParams = {
        roleName: 'engineer',
        jobRoleLocation: ['Gdansk', 'Buenos Aires'],
      };

      const results = await getFilteredJobRoles('token', filterParams);
      results[0].closingDate = new Date(results[0].closingDate);

      expect(results[0]).to.deep.equal(jobRoleResponse);
    });

    it('should throw exception when 404 error returned from axios', async () => {
      mock.onGet(URL + '/filter').reply(404);

      try {
        await getFilteredJobRoles('token');
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Currently no job-roles available');
        return;
      }
    });

    it('should throw exception when 500 error returned from axios', async () => {
      mock.onGet(URL + '/filter').reply(500);

      try {
        await getFilteredJobRoles('token');
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Currently no job-roles available');
        return;
      }
    });
  });

  describe('getJobRoleById', function () {
    it('should return job found by id', async () => {
      const data = jobRoleDetailsResponse;
      const id = jobRoleDetailsResponse.jobRoleId.toString();

      mock.onGet(URL + '/' + id).reply(200, data);

      const result = await getJobRoleById(id, 'token', errorMessage);
      result.closingDate = new Date(result.closingDate);

      expect(result).to.deep.equal(data);
    });

    it('should return error message if id out of scope', async () => {
      const id = '1000';
      mock.onGet(URL + '/' + id).reply(404);

      try {
        await getJobRoleById(id, 'token', errorMessage);
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal(errorMessage);
        return;
      }
    });

    it('should return error message if id is not number', async () => {
      const id = 'abc';
      mock.onGet(URL + '/' + id).reply(404);

      try {
        await getJobRoleById(id, 'token', errorMessage);
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal(errorMessage);
        return;
      }
    });

    it('should return error message if apply id out of scope', async () => {
      const id = '1000';
      mock.onGet(URL + '/' + id).reply(404);

      try {
        await getJobRoleById(id, 'token', errorMessage);
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Failed to get job role details.');
        return;
      }
    });
  });

  describe('postApplyFileForm', function () {
    it('should return job found by id when application job form is successful', async () => {
      const id = '1';
      mock
        .onPost(URL + '/' + id + '/applications')
        .reply(200, jobRoleDetailsResponse);

      const result = await postApplyFileForm('token', '1', mockMulterFile);
      result.closingDate = new Date(result.closingDate);

      expect(result).to.deep.equal(jobRoleDetailsResponse);
    });
    it('should return error message when application job form failes', async () => {
      const id = '1';
      mock.onPost(URL + '/' + id + '/applications').reply(500);

      try {
        await postApplyFileForm(id, 'token', mockMulterFile);
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Failed to post job apply form.');
        return;
      }
    });
  });

  describe('postBulkImportJobRoles', function () {
    it('should return nothing when bulk import csv is successful', async () => {
      mock.onPost(URL + '/import').reply(200);

      try {
        await postBulkImportJobRoles('token', mockMulterFileCSV);
      } catch (e) {
        expect.fail('The function should not throw an error');
      }
    });

    it('should return error message when application job form failes', async () => {
      mock.onPost(URL + '/import').reply(500);

      try {
        await postBulkImportJobRoles('token', mockMulterFileCSV);
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Failed to upload job roles.');
        return;
      }
    });

    it('should throw an error if file size exceeds 5MB', async () => {
      mockMulterFileCSV.buffer = Buffer.alloc(6 * 1024 * 1024);
      mockMulterFileCSV.size = 6 * 1024 * 1024;
      try {
        await postBulkImportJobRoles('token', mockMulterFileCSV);
        expect.fail('The function should throw an error');
      } catch (e) {
        expect(e.message).to.equal('File is bigger than 5MB');
      }
    });
  });

  describe('getMyAllApplications', async () => {
    it('should return myApplicationsResult object', async () => {
      const data = [myApplicationsResponse];
      mock.onGet(URL + '/my-job-applications').reply(200, data);

      const result = await getMyAllApplications('token');
      expect(result[0]).to.deep.equal(myApplicationsResponse);
    });

    it('should return error message when 401', async () => {
      mock.onGet(URL + '/my-job-applications').reply(401);

      try {
        await getMyAllApplications('wrongToken');
        expect(true).equal(false);
      } catch (e) {
        expect(e.message).to.equal('Currently You dont have any applications');
        return;
      }
    });
  });
});
