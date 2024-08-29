import * as AuthService from "../../../src/services/AuthService";
import * as AuthController from "../../../src/controllers/AuthController"; // Assuming you have this path
import { expect } from 'chai';
import sinon from 'sinon';
import { afterEach, describe, it } from "node:test";
import express from "express";

interface MockResponse extends express.Response {
    render: sinon.SinonSpy;
    redirect: sinon.SinonSpy;
    locals: {
        errormessage?: string;
    };
}

describe('AuthController', function () {
    afterEach(() => {
        sinon.restore();
    });

    describe('getLoginForm', function () {
        it('should render the login form', async () => {
            const req = {} as express.Request;
            const res = { render: sinon.spy() } as MockResponse;
    
            await AuthController.getLoginForm(req, res);
    
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('loginForm.html')).to.be.true;
        });
    });

    describe('postLoginForm', function () {
        it('should set session token and redirect on successful login', async () => {
            const token = 'testToken';
            sinon.stub(AuthService, 'getToken').resolves(token);
    
            const req = {
                body: { username: 'test', password: 'test' },
                session: {}
            } as express.Request;
            const res = { redirect: sinon.spy() } as MockResponse;
    
            await AuthController.postLoginForm(req, res);
            expect(req.session.token).to.equal(token);
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/')).to.be.true;
        });
    
        it('should render login form with error message on failed login', async () => {
            const errorMessage = 'Invalid credentials';
            sinon.stub(AuthService, 'getToken').rejects(new Error(errorMessage));
    
            const req = {
                body: { username: 'test', password: 'wrong' },
                session: {}
            } as express.Request;
            const res = {
                render: sinon.spy(),
                locals: {}
            } as MockResponse;
    
            await AuthController.postLoginForm(req, res);
    
            expect(res.locals.errormessage).to.equal(errorMessage);
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('loginForm.html', req.body)).to.be.true;
        });
    });
    
    describe('logOutUser', function () {
        it('should destroy session and redirect to home on successful logout', async () => {
            const req = {
                session: {
                    destroy(callback: (err: Error | null) => void) {
                        delete this.token;
                        callback(null);
                    },
                    token: 'test-token'
                },
                get: sinon.stub().returns('/')
            } as unknown as express.Request;

            const res = { redirect: sinon.spy() } as MockResponse;
    
            await AuthController.logOutUser(req, res);
    
            expect(req.session.token).to.be.undefined;
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/')).to.be.true;
        });
    
        it('should redirect to referer on session destroy error', async () => {
            const req = {
                session: {
                    destroy: sinon.stub().yields(new Error('Session error')),
                    token: 'test-token'
                },
                get: sinon.stub().returns('/previous-page')
            } as unknown as express.Request;
            const res = { redirect: sinon.spy() } as MockResponse;
    
            await AuthController.logOutUser(req, res);
    
            expect(req.session.token).to.not.null.and.not.undefined;
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/previous-page')).to.be.true;
        });
    
        it('should redirect to login if no session exists', async () => {
            const req = {} as express.Request;
            const res = { redirect: sinon.spy() } as MockResponse;
    
            await AuthController.logOutUser(req, res);
    
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/login')).to.be.true;
        });
    });
});
