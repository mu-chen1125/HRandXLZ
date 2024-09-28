// 初始化 Supabase 客户端
const supabaseUrl = 'https://vuxbqfacclzncwuyeiar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eGJxZmFjY2x6bmN3dXllaWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1MjQ1NDQsImV4cCI6MjA0MzEwMDU0NH0.-cDq2zClDjmzrH3N587jjyUn8Y9eWG9_xMGXh26N0Co';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 保存日志信息到 Supabase
async function saveLog(message) {
  const { data, error } = await supabase
    .from('logs')
    .insert([
      { message: message }
    ]);
  
  if (error) {
    console.error('日志保存出错：', error);
  } else {
    console.log('日志已保存：', data);
  }
}

// 从 Supabase 获取日志信息
async function getLogs() {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('日志读取出错：', error);
  } else {
    console.log('获取到的日志：', data);
    // 在页面中显示日志
    displayLogs(data);
  }
}

function displayLogs(logs) {
  const logContainer = document.getElementById('log-container');
  logContainer.innerHTML = ''; // 清空容器
  
  logs.forEach(log => {
    const logItem = document.createElement('div');
    logItem.textContent = `${log.created_at}: ${log.message}`;
    logContainer.appendChild(logItem);
  });
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化Swiper轮播
    new Swiper('.swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 设置计时器
    const meetDate = new Date('2024-07-16'); // 更新为您的相识日期
    const loveDate = new Date('2024-09-09'); // 恋爱纪念日保持不变

    function updateTimers() {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // 将当前时间设置为今天的开始

        const meetDate = new Date('2024-07-15T00:00:00'); // 更新为新的相识日期
        const loveDate = new Date('2024-09-09T00:00:00'); // 恋爱纪念日保持不变

        // 使用 UTC 时间来计算天数，避免时区问题
        const meetDays = Math.floor((now.getTime() - meetDate.getTime()) / (1000 * 60 * 60 * 24));
        const loveDays = Math.floor((now.getTime() - loveDate.getTime()) / (1000 * 60 * 60 * 24));

        document.querySelector('#meetTimer span').textContent = meetDays;
        document.querySelector('#loveTimer span').textContent = loveDays;
    }

    // 初始更新
    updateTimers();

    // 设置每天午夜更新一次
    function scheduleNextUpdate() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeUntilMidnight = tomorrow - now;
        setTimeout(() => {
            updateTimers();
            scheduleNextUpdate(); // 设置下一次更新
        }, timeUntilMidnight);
    }

    scheduleNextUpdate();

    // 日志功能
    async function getJournalEntries() {
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) {
            console.error('Error fetching journal entries:', error);
            saveLog('获取日志条目失败');
            return [];
        }
        saveLog('成功获取日志条目');
        return data;
    }

    async function saveJournalEntry(entry) {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert([entry]);
        
        if (error) {
            console.error('Error saving journal entry:', error);
            saveLog('保存日志条目失败');
            return false;
        }
        saveLog('成功保存日志条目');
        return true;
    }

    async function renderJournalEntries() {
        const journalEntries = await getJournalEntries();
        const journalContainer = document.getElementById('journalEntries');
        journalContainer.innerHTML = '';
        journalEntries.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            entryElement.innerHTML = `
                <h3>${entry.date} - ${entry.location}</h3>
                <p>${entry.description}</p>
                ${entry.image ? `<img src="${entry.image}" alt="${entry.description}">` : ''}
                <button onclick="editEntry(${entry.id})">编辑</button>
                <button onclick="deleteEntry(${entry.id})">删除</button>
            `;
            journalContainer.appendChild(entryElement);
        });
        console.log('Rendered entries:', journalEntries);
        saveLog('渲染日志条目');
    }

    async function saveEntry(entry) {
        const success = await saveJournalEntry(entry);
        if (success) {
            await renderJournalEntries();
            addJournalForm.reset();
            saveLog('新日志条目已添加');
        }
    }

    renderJournalEntries();

    // 添加新日志的功能
    const addJournalForm = document.getElementById('addJournalForm');
    const submitButton = addJournalForm.querySelector('button[type="submit"]');

    addJournalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        saveLog('提交了新的日志条目表单');
        const newEntry = {
            date: document.getElementById('entryDate').value,
            location: document.getElementById('entryLocation').value,
            description: document.getElementById('entryDescription').value,
            image: ''
        };

        const imageFile = document.getElementById('entryImage').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newEntry.image = e.target.result;
                saveEntry(newEntry);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveEntry(newEntry);
        }
    });

    // 编辑日志条目
    window.editEntry = async function(id) {
        const { data: entry, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching journal entry:', error);
            saveLog('获取要编辑的日志条目失败');
            return;
        }

        document.getElementById('entryDate').value = entry.date;
        document.getElementById('entryLocation').value = entry.location;
        document.getElementById('entryDescription').value = entry.description;
        editingIndex = id;
        submitButton.textContent = '保存修改';
        addJournalForm.scrollIntoView({ behavior: 'smooth' });
        saveLog('正在编辑日志条目');
    };

    // 删除日志条目
    window.deleteEntry = async function(id) {
        if (confirm('确定要删除这个日志条目吗？')) {
            const { error } = await supabase
                .from('journal_entries')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting journal entry:', error);
                saveLog('删除日志条目失败');
            } else {
                await renderJournalEntries();
                saveLog('成功删除日志条目');
            }
        }
    };

    // 流星效果
    function createMeteor() {
        const meteorShower = document.getElementById('meteor-shower');
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.top = `${Math.random() * window.innerHeight}px`;
        meteor.style.right = '-200px';
        meteor.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        meteorShower.appendChild(meteor);

        setTimeout(() => {
            meteorShower.removeChild(meteor);
        }, 1500);
    }

    // 每隔一段时间生成一颗流星
    setInterval(createMeteor, 1500);

    // 下落的小爱心效果
    function createHeart() {
        const fallingHearts = document.getElementById('falling-hearts');
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.animationDuration = `${Math.random() * 2 + 1}s`; // 降低持续时间，使小爱心更快
        fallingHearts.appendChild(heart);

        setTimeout(() => {
            fallingHearts.removeChild(heart);
        }, 3000); // 减少移除时间
    }

    // 每隔一段时间生成一个小爱心
    setInterval(createHeart, 1000); // 更频繁地生成小爱心

    // 在页面加载时获取日志
    getLogs();
});