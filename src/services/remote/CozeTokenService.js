import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import application from '../../resource/application.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { CozeAPI, getJWTToken, COZE_COM_BASE_URL } from '@coze/api';

class CozeTokenService {
  constructor() {
    this.baseURL = COZE_COM_BASE_URL;
    this.appId = application.coze.appId;
    this.keyId = application.coze.keyId;
    this.aud = application.coze.aud;
    
    // 读取私钥
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    this.privateKey = fs
      .readFileSync(join(__dirname, '../../resources/private_key.pem'))
      .toString();

    this.tokenCache = null;
    this.tokenExpireTime = null;
    this.client = null;
  }

  /**
   * 获取新的access token
   * @returns {Promise<{access_token: string, expires_in: number}>}
   */
  async getNewToken() {
    try {
      const result = await getJWTToken({
        baseURL: this.baseURL,
        appId: this.appId,
        aud: this.aud,
        keyid: this.keyId,
        privateKey: this.privateKey,
      });

      return result;
    } catch (error) {
      console.error('Failed to get Coze token:', error);
      throw new Error('获取Coze Token失败');
    }
  }

  /**
   * 检查token是否过期
   * @returns {boolean}
   */
  isTokenExpired() {
    if (!this.tokenExpireTime) return true;
    // 提前5分钟刷新token
    return Date.now() >= this.tokenExpireTime - 5 * 60 * 1000;
  }

  /**
   * 获取有效的client实例
   * @returns {Promise<CozeAPI>}
   */
  async getClient() {
    try {
      if (!this.client || this.isTokenExpired()) {
        const tokenResult = await this.getNewToken();
        
        // 设置过期时间
        this.tokenExpireTime = Date.now() + tokenResult.expires_in * 1000;
        this.tokenCache = tokenResult.access_token;
        
        // 创建新的client实例
        this.client = new CozeAPI({ 
          baseURL: this.baseURL, 
          token: tokenResult.access_token 
        });
      }

      return this.client;
    } catch (error) {
      console.error('Failed to get Coze client:', error);
      throw new Error('获取Coze客户端失败');
    }
  }
}

// 导出单例
export default new CozeTokenService();