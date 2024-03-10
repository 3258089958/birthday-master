require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
const API_URL = "https://api.openai.com/v1/completions";
app.post('/api/game-process', async (req, res) => {
    const { gameType, userInput } = req.body;
    let prompt = '';

    if (gameType === 'wish-generator') {
        prompt = `给出一个根据以下关键词 "${userInput}" 的生日愿望：`;
    } else if (gameType === 'future-letter') {
        prompt = `写一封来自五年后的信，描述${userInput}的生活：`;
    }

    try {
        const response = await axios.post(API_URL, {
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 256
        }, {
            headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` }
        });

        const content = response.data.choices[0].text.trim();
        res.json({ content });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).send('Error processing your request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
