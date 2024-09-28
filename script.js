window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

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
    const meetDate = new Date('2024-07-15'); // 相识日期为2024年07月15日
    const loveDate = new Date('2024-09-09'); // 设置恋爱纪念日为2024年09月09日

    function updateTimers() {
        const now = new Date();
        const meetDays = Math.floor((now - meetDate) / (1000 * 60 * 60 * 24));
        const loveDays = Math.floor((now - loveDate) / (1000 * 60 * 60 * 24));

        document.querySelector('#meetTimer span').textContent = meetDays;
        document.querySelector('#loveTimer span').textContent = loveDays;
    }

    updateTimers();
    setInterval(updateTimers, 86400000); // 每天更新一次

    // 日志功能
    let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    let editingIndex = -1; // 新增：用于跟踪正在编辑的条目索引

    function saveEntries() {
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        console.log('Saved entries:', journalEntries); // 调试信息
    }

    function renderJournalEntries() {
        const journalContainer = document.getElementById('journalEntries');
        journalContainer.innerHTML = '';
        journalEntries.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            entryElement.innerHTML = `
                <h3>${entry.date} - ${entry.location}</h3>
                <p>${entry.description}</p>
                ${entry.image ? `<img src="${entry.image}" alt="${entry.description}">` : ''}
                <button onclick="editEntry(${index})">编辑</button>
                <button onclick="deleteEntry(${index})">删除</button>
            `;
            journalContainer.appendChild(entryElement);
        });
        console.log('Rendered entries:', journalEntries); // 调试信息
    }

    renderJournalEntries();

    // 添加新日志的功能
    const addJournalForm = document.getElementById('addJournalForm');
    const submitButton = addJournalForm.querySelector('button[type="submit"]');

    addJournalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted'); // 调试信息
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

    function saveEntry(entry) {
        console.log('Saving entry:', entry); // 调试信息
        if (editingIndex === -1) {
            journalEntries.push(entry);
        } else {
            journalEntries[editingIndex] = entry;
            editingIndex = -1;
            submitButton.textContent = '添加新日志';
        }
        saveEntries();
        renderJournalEntries();
        addJournalForm.reset();
    }

    // 编辑日志条目
    window.editEntry = function(index) {
        const entry = journalEntries[index];
        document.getElementById('entryDate').value = entry.date;
        document.getElementById('entryLocation').value = entry.location;
        document.getElementById('entryDescription').value = entry.description;
        // 无法直接设置文件输入的值，所以我们跳过图片
        editingIndex = index;
        submitButton.textContent = '保存修改';
        // 滚动到表单
        addJournalForm.scrollIntoView({ behavior: 'smooth' });
    };

    // 删除日志条目
    window.deleteEntry = function(index) {
        if (confirm('确定要删除这个日志条目吗？')) {
            journalEntries.splice(index, 1);
            saveEntries();
            renderJournalEntries();
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
});