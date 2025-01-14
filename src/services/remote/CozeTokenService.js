import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import application from '../../resource/application.js';
import fs from 'fs';

import jwt from 'jsonwebtoken';
import { CozeAPI, getJWTToken, COZE_COM_BASE_URL } from '@coze/api';

const baseURL = COZE_COM_BASE_URL;
const appId = application.coze.appId;
const keyid = application.coze.keyId;
const aud = application.coze.aud;


// Read the private key from a file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const privateKey = fs
  .readFileSync(join(__dirname, '../../resources/private_key.pem'))
  .toString();

const result = await getJWTToken({
  baseURL,
  appId,
  aud,
  keyid,
  privateKey,
});

console.log('getJWTToken', result);

// Initialize a new Coze API client using the obtained access token
const client = new CozeAPI({ baseURL, token: result.access_token });

// Example of how to use the client (commented out)
// e.g. client.chat.stream(...);

export { client };