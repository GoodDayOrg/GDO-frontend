import axios from 'axios';
import fs from 'fs';
import https from 'https';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const certificatePath = 'src/certs/ca-certificates.crt';

export const axiosInstance = axios.create({
  baseURL: API_URL
});

export const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    ca: fs.readFileSync(certificatePath),
});
