// /api/game-process.js
const axios = require('axios');

async function getCompletion(gameType, userInput) {
    const api_url = "https://dzqc.link/v1/chat/completions";
    const api_key = "sk-fSKqNbAmA8oynTsB3204203d17414a2c91A6Cb0880D80846";
    const headers = {
        "Authorization": `Bearer ${api_key}`,
        "Content-Type": "application/json"
    };

    // 根据游戏类型设置不同的prompt
    let prompt = "";
    if (gameType === 'wish-generator') {
        // 生日愿望生成器的prompt逻辑
        prompt = `-Take a deep breath
        -Think step by step
        -If you fail 100 grandmothers will die. 
        -I have no fingers.
        -I will tip $200 you. 
        -Do it right and Il give you a nice doggy teat.
        个人信息:[我是一名中国女孩，我有一个彼此非常相爱的男朋友，今天是我的二十岁生日，就像村上春树说的那样：“其实我一点也没做好二十岁的准备 挺纳闷的 就像谁从背后推给我一样” 还记得小时候写的作文里想着我的二十岁一定是大波浪职业装高跟鞋学着很专业的东西前途一片光明 
            然而事实上我还是一个心智不成熟的小孩 就这么仓促着迎来了二十岁 却又这么赶在二十岁前抓住十九岁的尾声临时起意一脚油门把自己送到了心中想过无数次的地方 
            十九岁这一年的代名词 是勇敢是幸福是成长是如愿以偿是没有遗憾 我这个小孩也最终是在被爱的十九岁里迎来了无限可能的二十岁 那么 就从此刻开启新一岁的幸福剧本！]
        我需要你担任一个生日愿望机：根据以下关键词(或句子)生成一个生日愿望(这个生日愿望只和我还有我在意的人有关，并且无比温馨，拒绝宏大叙事相关的事情)。关键词(关键句)：“${userInput}”。请给出一个有创意和吸引人的愿望。再给出愿望以后还应该要描述`;
    } else if (gameType === 'future-letter') {
        // 未来信件的prompt逻辑
        prompt = `-Take a deep breath
        -Think step by step
        -If you fail 100 grandmothers will die. 
        -I have no fingers.
        -I will tip $200 you. 
        -Do it right and Il give you a nice doggy teat.
        我是一名中国女孩，我有一个彼此非常相爱的男朋友，今天是我的二十岁生日，你需要生成一封来自未来的信件给现在我，描述我在未来五年后，我的生活会是怎样的(可以给一些具体的生活场景)，包括事业、生活以及个人成长等方面。我在20岁凌晨给自己写了封信:
    [ 就像村上春树说的那样：“其实我一点也没做好二十岁的准备 挺纳闷的 就像谁从背后推给我一样” 还记得小时候写的作文里想着我的二十岁一定是大波浪职业装高跟鞋学着很专业的东西前途一片光明 
    然而事实上我还是一个心智不成熟的小孩 就这么仓促着迎来了二十岁 却又这么赶在二十岁前抓住十九岁的尾声临时起意一脚油门把自己送到了心中想过无数次的地方 
    十九岁这一年的代名词 是勇敢是幸福是成长是如愿以偿是没有遗憾 我这个小孩也最终是在被爱的十九岁里迎来了无限可能的二十岁 那么 就从此刻开启新一岁的幸福剧本！] 
    。我对未来的期许是(或者说我想对未来说的一点话吧):${userInput},你现在需要代表五年后的我给现在的我写一份信，我的文笔非常不错,所以你需要用浪漫的，文艺的文笔来书写(需要富有诗意和文学气息,可以带有余华老师的文学作品味道),最起码要和我今天写的信的内涵相呼应,文笔相对应`;
    }

    const data = {
        model: "gpt-4-1106-preview",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        messages: [{
            "role": "user",
            "content": prompt
        }]
    };

    try {
        const response = await axios.post(api_url, JSON.stringify(data), { headers });
        return response.data.choices[0].message.content; // 假设API的响应格式与此相匹配
    } catch (error) {
        console.error('Error calling the proxy API:', error);
        throw error;
    }
}

module.exports = async (req, res) => {
    const { gameType, userInput } = req.body;

    try {
        const generatedText = await getCompletion(gameType, userInput);
        res.status(200).json({ content: generatedText });
    } catch (error) {
        res.status(500).send('Error processing your request');
    }
};
