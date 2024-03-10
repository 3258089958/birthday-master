document.getElementById('wish-generator').addEventListener('click', function() {
    showInputSection('wish-generator');
});

document.getElementById('future-letter').addEventListener('click', function() {
    showInputSection('future-letter');
});

document.getElementById('submit-game-input').addEventListener('click', function() {
    const gameType = document.getElementById('game-input-section').getAttribute('data-game-type');
    const userInput = document.getElementById('game-input').value;
    submitGameInput(gameType, userInput);
});

function showInputSection(gameType) {
    const inputSection = document.getElementById('game-input-section');
    inputSection.style.display = 'block';
    inputSection.setAttribute('data-game-type', gameType); // 保存游戏类型以供提交时使用
    document.getElementById('game-input').value = ''; // 清空输入
    document.getElementById('game-output').innerText = ''; // 清空输出
}

function submitGameInput(gameType, userInput) {
    fetch('/api/game-process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameType: gameType,
            userInput: userInput
        }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('game-output').innerText = data.content; // 显示GPT生成的内容
    })
    .catch(error => console.error('Error:', error));
}
