import * as JobRoleController from '../../../src/controllers/JobRoleController';
import * as JobRoleService from '../../../src/services/JobRoleService';
import { expect } from 'chai';
import { JobRoleResponse } from '../../../src/models/JobRoleResponse';
import sinon from 'sinon';
import { afterEach, describe, it } from 'node:test';
import express from 'express';

const jobRoleResponse: JobRoleResponse = {
  jobRoleId: 1,
  roleName: 'delivery_master',
  jobRoleLocation: 'Buenos Aires',
  capabilityName: 'delivery',
  bandName: 'Architect',
  closingDate: new Date('10/10/2024'),
};

interface MockResponse extends express.Response {
  render: sinon.SinonSpy;
  locals: {
    errormessage: string;
  };
}

describe('JobRoleContoller', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('getJobRoles', function () {
    it('should render view with job roles when job roles returned', async () => {
      const jobRolesList = [jobRoleResponse];

      sinon.stub(JobRoleService, 'getAllJobRoles').resolves(jobRolesList);

      const req = {
        query: {
        }
      };
      const res = { render: sinon.spy() } as MockResponse;

      await JobRoleController.getJobRoles(req as express.Request, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-role-list', { jobRoles: jobRolesList }))
        .to.be.true;
    });

    it('should render view with error message when error thrown', async () => {
      const errorMessage: string = 'Error message';
      sinon
        .stub(JobRoleService, 'getAllJobRoles')
        .rejects(new Error(errorMessage));

        const req = {
          query: {
          }
        };
      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.getJobRoles(req as express.Request, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-role-list')).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });
});
