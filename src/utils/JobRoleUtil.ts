import { JobRoleFilterParams } from "../models/JobRoleFilterParams";
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

export const extractJobRoleFilterParams = (req: express.Request): JobRoleFilterParams => {
  return {
    roleName: req.query.roleName as string | undefined,
    jobRoleLocation: req.query.jobRoleLocation as string | undefined,
    capabilityId: req.query.capabilityId ? Number(req.query.capabilityId ) : undefined,
    bandId: req.query.bandId ? Number(req.query.bandId) : undefined,
    closingDate: req.query.closingDate as string | undefined,
  }
}
