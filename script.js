// 初始化 Supabase 客户端
const supabaseUrl = 'https://vuxbqfacclzncwuyeiar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eGJxZmFjY2x6bmN3dXllaWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1MjQ1NDQsImV4cCI6MjA0MzEwMDU0NH0.-cDq2zClDjmzrH3N587jjyUn8Y9eWG9_xMGXh26N0Co';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 保存日志信息到 Supabase
async function saveLog(message) {
  try {
    const { data, error } = await supabase
      .from('logs')
      .insert([{ message: message }]);
    
    if (error) throw error;
    console.log('日志已保存：', data);
  } catch (error) {
    console.error('日志保存出错：', error);
  }
}

// 从 Supabase 获取日志信息
async function getLogs() {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    console.log('获取到的日志：', data);
    displayLogs(data);
  } catch (error) {
    console.error('日志读取出错：', error);
  }
}

function displayLogs(logs) {
  const logContainer = document.getElementById('log-container');
  logContainer.innerHTML = '';
  
  logs.forEach(log => {
    const logItem = document.createElement('div');
    logItem.textContent = `${new Date(log.created_at).toLocaleString()}: ${log.message}`;
    logContainer.appendChild(logItem);
  });
}

function updateTimers() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const meetDiff = Math.max(0, Math.floor((now - meetDate) / (1000 * 60 * 60 * 24)));
    const loveDiff = Math.max(0, Math.floor((now - loveDate) / (1000 * 60 * 60 * 24)));

    document.querySelector('#meetTimer span').textContent = meetDiff;
    document.querySelector('#loveTimer span').textContent = loveDiff;
}

document.addEventListener('DOMContentLoaded', function() {
    let meetDate = new Date('2024-07-16T00:00:00');
    let loveDate = new Date('2024-09-09T00:00:00');

    // 初始化Swiper轮播
    new Swiper('.swiper', {
        loop: true,
        pagination: { el: '.swiper-pagination' },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    updateTimers(); // 立即更新计时器
    setInterval(updateTimers, 86400000); // 每24小时更新一次

    getLogs();

    // 日志表单提交事件
    const addJournalForm = document.getElementById('addJournalForm');
    addJournalForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const messageInput = document.getElementById('journalMessage');
        const message = messageInput.value.trim();
        if (message) {
            saveLog(message);
            messageInput.value = '';
            // 重新获取日志
            getLogs();
        }
    });

    // 流星效果
    function createMeteor() {
        const meteorShower = document.getElementById('meteor-shower');
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.top = `${Math.random() * window.innerHeight}px`;
        meteor.style.right = '-200px';
        meteor.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
        meteorShower.appendChild(meteor);

        setTimeout(() => {
            meteorShower.removeChild(meteor);
        }, 2000);
    }

    // 每隔一段时间生成一颗流星
    setInterval(createMeteor, 2000); // 降低生成频率，每2秒生成一颗流星

    // 下落的小爱心效果
    function createHeart() {
        const fallingHearts = document.getElementById('falling-hearts');
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.animationDuration = `${Math.random() * 2 + 2}s`;
        fallingHearts.appendChild(heart);

        setTimeout(() => {
            fallingHearts.removeChild(heart);
        }, 4000);
    }

    // 每隔一段时间生成一个小爱心
    setInterval(createHeart, 1500); // 降低生成频率，每1.5秒生成一个小爱心

    saveLog('网站初始化：相识日期设置为2024年07月16日，恋爱纪念日设置为2024年09月09日');

    const editDatesBtn = document.getElementById('editDatesBtn');
    const editDatesModal = document.getElementById('editDatesModal');
    const saveDatesBtn = document.getElementById('saveDatesBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const newMeetDateInput = document.getElementById('newMeetDate');
    const newLoveDateInput = document.getElementById('newLoveDate');

    editDatesBtn.addEventListener('click', function() {
        editDatesModal.style.display = 'block';
        newMeetDateInput.value = meetDate.toISOString().split('T')[0];
        newLoveDateInput.value = loveDate.toISOString().split('T')[0];
    });

    cancelEditBtn.addEventListener('click', function() {
        editDatesModal.style.display = 'none';
    });

    saveDatesBtn.addEventListener('click', function() {
        const newMeetDate = new Date(newMeetDateInput.value + 'T00:00:00');
        const newLoveDate = new Date(newLoveDateInput.value + 'T00:00:00');

        if (newMeetDate && newLoveDate) {
            meetDate = newMeetDate;
            loveDate = newLoveDate;
            updateTimers();
            editDatesModal.style.display = 'none';
            saveLog(`日期已更新：相识日期 ${meetDate.toLocaleDateString()}, 恋爱纪念日 ${loveDate.toLocaleDateString()}`);
        } else {
            alert('请输入有效的日期');
        }
    });

    // 更新 updateTimers 函数，使用全局变量
    function updateTimers() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const meetDiff = Math.max(0, Math.floor((now - meetDate) / (1000 * 60 * 60 * 24)));
        const loveDiff = Math.max(0, Math.floor((now - loveDate) / (1000 * 60 * 60 * 24)));

        document.querySelector('#meetTimer span').textContent = meetDiff;
        document.querySelector('#loveTimer span').textContent = loveDiff;
    }

    function checkPerformance() {
        const now = performance.now();
        setTimeout(() => {
            const elapsed = performance.now() - now;
            if (elapsed > 100) { // 将阈值从 50ms 增加到 100ms
                clearInterval(meteorInterval);
                clearInterval(heartInterval);
                meteorInterval = setInterval(createMeteor, 3000);
                heartInterval = setInterval(createHeart, 2000);
            }
        }, 1000);
    }

    let meteorInterval = setInterval(createMeteor, 2000);
    let heartInterval = setInterval(createHeart, 1500);

    checkPerformance();
    setInterval(checkPerformance, 10000); // 每10秒检查一次性能
});