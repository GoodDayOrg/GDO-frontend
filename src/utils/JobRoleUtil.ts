import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import express from 'express';

export const formatDate = (date?: Date): string => {
  return date == null
    ? 'N/A'
    : new Date(date).toLocaleDateString('pl-PL', {
        // you can use undefined as first argument
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
};

export const extractJobRoleFilterParams = (
  req: express.Request,
): JobRoleFilterParams => {
  const params: JobRoleFilterParams = {};

  if (req.query.roleName) {
    params.roleName = req.query.roleName as string;
  }
  if (req.query.jobRoleLocation) {
    console.log();
    params.jobRoleLocation = req.query.jobRoleLocation as string[];
  }
  if (req.query.capabilityName) {
    params.capabilityName = req.query.capabilityName as string[];
  }
  if (req.query.bandName) {
    params.bandName = req.query.bandName as string[];
  }
  if (req.query.closingDate) {
    params.closingDate = req.query.closingDate as string;
  }

  return params;
};
