import express from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import { allowRoles } from '../../../src/middlewares/AuthMiddleware';
import { UserRole } from '../../../src/models/JwtToken';
// import { jwtDecode } from "jwt-decode";
// import "jwt-decode"; 
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jwt-decode");

interface MockResponse extends express.Response {
    render: sinon.SinonSpy;
    redirect: sinon.SinonSpy;
    locals: {
        errormessage?: string;
    };
    send: sinon.SinonSpy;
}

describe('allowRoles Middleware', function () {
    let req: express.Request;
    let res: MockResponse;
    let next: sinon.SinonSpy;

    beforeEach(() => {
        next = sinon.spy();
    });
    afterEach(() => {
        sinon.restore();
    });

    it('should redirect to login if no token is present in session', () => {
        req = {
            session: {}
        } as express.Request;

        res = { redirect: sinon.spy() } as MockResponse;
        const middleware = allowRoles();

        middleware(req as express.Request, res as express.Response, next);
        expect(res.redirect.calledWith('/login')).to.be.true;
        expect(next.calledOnce).to.be.false;
    });

    it('should return 403 if user role is not authorized', () => {
        req = {
            session: { token: 'valid-token' }
        } as express.Request;

        res = {
            redirect: sinon.spy(),
            status: (function (status: number) {
                this.status = status
                return this;
            }),
            send: function (send: string) {
                this.send = send
                return this;
            },
        } as unknown as MockResponse;
        sinon.stub(jwt, 'jwtDecode').callsFake(() => {return UserRole.User});

        const middleware = allowRoles([UserRole.Admin]);

        middleware(req as express.Request, res as express.Response, next);
        expect(res.status).to.equal(403);
        expect(res.send).to.equal('User role not authorised for this action');
        expect(next.calledOnce).to.be.false;
    });

    it('should call next if user role is authorized', () => {
        req = {
            session: { token: 'valid-token' }
        } as express.Request;

        res = {
            redirect: sinon.spy(),
            status: (function (status: number) {
                this.status = status
                return this;
            }),
            send: function (send: string) {
                this.send = send
                return this;
            },
        } as unknown as MockResponse;
        sinon.stub(jwt, 'jwtDecode').callsFake(() => {return UserRole.User});

        const middleware = allowRoles([UserRole.Admin]);

        middleware(req as express.Request, res as express.Response, next);

        expect(next.calledOnce).to.be.false;
    });

    it('should call next if no roles are specified', () => {
        req = {
            session: { token: 'valid-token' }
        } as express.Request;

        res = {
            redirect: sinon.spy(),
            status: (function (status: number) {
                this.status = status
                return this;
            }),
            send: function (send: string) {
                this.send = send
                return this;
            },
        } as unknown as MockResponse;
        sinon.stub(jwt, 'jwtDecode').callsFake(() => {return UserRole.User});

        const middleware = allowRoles(); 

        middleware(req as express.Request, res as express.Response, next);

        expect(next.calledOnce).to.be.true;
    });
});
