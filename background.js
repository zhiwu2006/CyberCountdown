// 计算时间差
function calculateTimeLeft(targetDate) {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
}

// 获取目标时间
async function getTargetDate() {
    const result = await chrome.storage.sync.get(['targetDate']);
    return result.targetDate ? new Date(result.targetDate).getTime() : new Date('2025-05-18T09:00:00').getTime();
}

// 更新badge显示
async function updateBadge() {
    const targetDate = await getTargetDate();
    const timeLeft = calculateTimeLeft(targetDate);
    
    chrome.action.setBadgeText({
        text: String(timeLeft.days)
    });
    
    chrome.action.setBadgeBackgroundColor({
        color: '#64ffda'
    });
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTimeLeft") {
        getTargetDate().then(targetDate => {
            sendResponse(calculateTimeLeft(targetDate));
        });
        return true; // 保持消息通道开放
    }
});

// 设置定时更新badge
chrome.alarms.create('updateBadge', {
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateBadge') {
        updateBadge();
    }
});

// 初始化时更新一次badge
updateBadge();

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.targetDate) {
        updateBadge();
    }
});
