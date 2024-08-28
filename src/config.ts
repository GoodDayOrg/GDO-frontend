import fs from 'fs';
import https from 'https';

export const API_URL = process.env.API_URL || 'http://localhost:8080';

const certificatePath = '/etc/ssl/certs/ca-certificates.crt'

export const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    ca: fs.readFileSync(certificatePath),
});
