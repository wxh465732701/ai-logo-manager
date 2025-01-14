const { ResponseDTO } = require('../models/ResponseDTO');
const ServiceContainer = require('../common/ServiceContainer').default;

class CozeController {
    constructor(cozeService) {
        this.cozeService = cozeService;
    }

    /**
     * 与 Coze Bot 进行对话
     * @param {Object} req - Express 请求对象
     * @param {Object} res - Express 响应对象
     */
    async chat(req, res) {
        try {
            const { botId, message } = req.body;
            
            if (!botId || !message) {
                return res.json(new ResponseDTO(false, 'Bot ID and message are required'));
            }

            const response = await this.cozeService.chat(botId, message);
            return res.json(response);
        } catch (error) {
            console.error('CozeController chat error:', error);
            return res.json(new ResponseDTO(false, error.message || 'Failed to process chat request'));
        }
    }
}

module.exports = CozeController; 