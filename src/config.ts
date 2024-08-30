import axios from 'axios';
import fs from 'fs';
import https from 'https';

const API_URL = process.env.API_URL || 'http://localhost:8080';

let agent: https.Agent | undefined;
if (!API_URL.includes('localhost')) {
  agent = new https.Agent({
    ca: fs.readFileSync('/etc/ssl/certs/ca-certificates.crt'),
  });
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  httpsAgent: agent,
});
