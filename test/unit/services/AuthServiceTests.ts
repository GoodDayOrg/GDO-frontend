import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { axiosInstance } from "../../../src/config";
import { getToken } from "../../../src/services/AuthService";

const URL: string = "/api/auth/login";

const mock = new MockAdapter(axiosInstance);

describe('AuthService', function () {
    afterEach(() => {
        mock.reset();
    });

    describe('getToken', function () {
        it('should return token on successful login', async () => {
            const loginRequest = { username: 'test', password: 'test' };
            const expectedToken = 'mocked-token';
            
            mock.onPost(URL).reply(200, expectedToken);

            const result = await getToken(loginRequest);

            expect(result).to.equal(expectedToken);
        });

        it('should throw exception on 500 error from axios', async () => {
            const loginRequest = { username: 'test', password: 'test' };
            
            mock.onPost('/api/auth/login').reply(500);

            try {
                await getToken(loginRequest);
                expect(true).equal(false);
            } catch (e) {
                expect(e.message).to.equal('Failed to sign in');
            }
        });

      it('should throw exception on 404 error from axios', async () => {
        const loginRequest = { username: 'test', password: 'test' };
        
        mock.onPost('/api/auth/login').reply(404);

        try {
            await getToken(loginRequest);
            expect(true).equal(false);
        } catch (e) {
            expect(e.message).to.equal('Failed to sign in');
        }
    });
    })
})