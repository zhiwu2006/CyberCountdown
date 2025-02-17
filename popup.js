let countdownInterval;

function updateDisplay(timeLeft) {
    if (!timeLeft) return;
    
    document.getElementById('days').textContent = String(timeLeft.days).padStart(3, '0');
    document.getElementById('hours').textContent = String(timeLeft.hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(timeLeft.minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(timeLeft.seconds).padStart(2, '0');
}

function startCountdown() {
    // 立即更新一次
    chrome.runtime.sendMessage({action: "getTimeLeft"}, function(response) {
        if (response) updateDisplay(response);
    });

    // 设置定期更新
    countdownInterval = setInterval(() => {
        chrome.runtime.sendMessage({action: "getTimeLeft"}, function(response) {
            if (response) updateDisplay(response);
        });
    }, 1000);
}

// 页面加载时启动
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});

// 页面关闭时清理
window.addEventListener('unload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});
