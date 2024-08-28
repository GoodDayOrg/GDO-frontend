import express from "express";

export const allowRoles = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.session.token) {
            return res.redirect('/login');
        }

        next();
    }
}