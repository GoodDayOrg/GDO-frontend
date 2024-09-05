import express from 'express';
import { jwtDecode } from 'jwt-decode';
import { JwtToken, UserRole } from '../models/JwtToken';

export const allowRoles = (allowedRoles?: UserRole[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (!req.session.token) {
      return res.redirect('/login');
    }

    const decodedToken: JwtToken = jwtDecode(req.session.token);
    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(decodedToken.role_id)
    ) {
      return res.status(403).send('User role not authorised for this action');
    }
    if (res.locals) {
      res.locals.session = req.session;
      res.locals.userRole = UserRole[decodedToken.role_id];
    }

    next();
  };
};

export const redirectIfLogged = () => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (req.session.token) {
      return res.redirect('/');
    }
    next();
  };
};
