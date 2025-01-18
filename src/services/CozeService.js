import { ChatEventType, RoleType } from '@coze/api';
import CozeTokenService from './remote/CozeTokenService.js';
import { ResponseDTO } from '../models/ResponseDTO.js';

class CozeService {
    /**
     * 与 Coze Bot 进行对话
     * @param {string} botId - Bot ID
     * @param {string} message - 用户消息
     * @returns {Promise<ResponseDTO>} 返回对话结果
     */
    async chat(botId, message) {
        try {
            // 获取有效的client实例
            const client = await CozeTokenService.getClient();
            
            const stream = await client.chat.stream({
                bot_id: botId,
                additional_messages: [
                    {
                        role: RoleType.User,
                        content: message,
                        content_type: 'text',
                    },
                ],
            });
            
            let response = '';
            for await (const part of stream) {
                if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                    response += part.data.content;
                }
            }

            return new ResponseDTO(true, 'Success', { content: response });
        } catch (error) {
            console.error('Coze chat error:', error);
            return new ResponseDTO(false, error.message || 'Failed to chat with Coze bot');
        }
    }

    /**
     * 获取Bot信息
     * @param {string} botId - Bot ID
     * @returns {Promise<ResponseDTO>}
     */
    async getBotInfo(botId) {
        try {
            const client = await CozeTokenService.getClient();
            const botInfo = await client.bot.get(botId);
            return new ResponseDTO(true, 'Success', botInfo);
        } catch (error) {
            console.error('Get bot info error:', error);
            return new ResponseDTO(false, error.message || 'Failed to get bot info');
        }
    }
}

export default new CozeService(); 