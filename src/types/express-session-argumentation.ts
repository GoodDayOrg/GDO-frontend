import 'express-session';
import { JobRoleResponse } from '../models/JobRoleResponse';

declare module 'express-session' {
  interface SessionData {
    token: string;
    jobRoles: JobRoleResponse[];
  }
}
