import 'express-session';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';

declare module 'express-session' {
  interface SessionData {
    token: string;
    jobRoles: JobRoleResponse[];
    filters: JobRoleFilterParams;
  }
}
