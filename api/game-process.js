// /api/game-process.js
const axios = require('axios');

// 设置OpenAI参数
function setOpenParams(
    model = "gpt-3.5-turbo",
    temperature = 0.7,
    max_tokens = 256,
    top_p = 1,
    frequency_penalty = 0,
    presence_penalty = 0
) {
    return {
        model,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
    };
}

// 通过中转API获取完成情况
async function getCompletion(params, messages) {
    const api_url = "https://dzqc.link/v1/chat/completions"; // 中转API的URL
    const api_key = "sk-fSKqNbAmA8oynTsB3204203d17414a2c91A6Cb0880D80846"; // 替换为你的中转API密钥
    const headers = {
        "Authorization": `Bearer ${api_key}`,
        "Content-Type": "application/json"
    };
    const data = {
        model: params.model,
        messages: messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        top_p: params.top_p,
        frequency_penalty: params.frequency_penalty,
        presence_penalty: params.presence_penalty
    };

    try {
        const response = await axios.post(api_url, data, { headers });
        return response.data; // 返回响应的JSON数据
    } catch (error) {
        console.error('Error calling the proxy API:', error);
        throw error; // 重新抛出错误，供上层处理
    }
}

module.exports = async (req, res) => {
    // 解析请求体中的数据
    const { gameType, userInput } = req.body;
    const params = setOpenParams();
    const prompt = gameType === 'wish-generator' ? userInput : `写一封来自五年后的信，描述${userInput}的生活：`;
    const messages = [{ role: "user", content: prompt }];

    try {
        const response = await getCompletion(params, messages);
        const generatedText = response.choices[0].message.content;
        res.status(200).json({ content: generatedText });
    } catch (error) {
        res.status(500).send('Error processing your request');
    }
};
