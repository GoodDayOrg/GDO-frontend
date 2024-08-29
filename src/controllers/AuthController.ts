import express from "express";
import { getToken } from "../services/AuthService";
import '../types/express-session-argumentation'; 

export const getLoginForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('loginForm.html');
}

export const postLoginForm = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        req.session.token = await getToken(req.body);
        res.redirect('/');
    } catch (e) {
        res.locals.errormessage = e.message;
        res.render('loginForm.html', req.body);
    }
}

export const logOutUser = async (req: express.Request, res: express.Response): Promise<void> => {
    if(req.session){
        req.session.destroy(err => {
            if (err) {
                res.redirect(req.get('referer'));
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/login');
    }
}