import { Client, Account, ID } from 'node-appwrite';
import 'dotenv/config';

// 初始化 Appwrite 客户端
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

// 初始化 Account
const account = new Account(client);

export {
    client,
    account,
    ID
}; 