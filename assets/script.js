document.addEventListener('DOMContentLoaded', function() {
    let timeLeft;
    let clickCount = 0;
    let isGameRunning = false;
    let timer;
    let startTime = 5;
    let highScore = localStorage.getItem('highScore') || 0;
    let combo = 0;
    let lastClickTime = 0;

    const timerDisplay = document.getElementById('timer');
    const clickDisplay = document.getElementById('click-count');
    const box = document.querySelector('.box');
    const timeButtons = document.querySelectorAll('[id^="time-select"]');
    const gameContainer = document.getElementById('game-container');

    // Initialize displays
    updateDisplays();

    function updateDisplays() {
        timerDisplay.textContent = `Time: ${timeLeft?.toFixed(1) || startTime}`;
        clickDisplay.textContent = `Clicks: ${clickCount}`;
        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = document.querySelector('.progress');
        if (progress && timeLeft) {
            const percentage = (timeLeft / startTime) * 100;
            progress.style.width = `${percentage}%`;
        }
    }

    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            startTime = parseInt(this.textContent);
            timeLeft = startTime;
            resetGame();
            addClickEffect(this);
        });
    });

    function addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    box.addEventListener('click', function(e) {
        if (!isGameRunning) {
            startGame();
        }
        if (isGameRunning) {
            clickCount++;
            const currentTime = Date.now();
            if (currentTime - lastClickTime < 300) { // 300ms threshold for combo
                combo++;
                createComboText(e);
            } else {
                combo = 0;
            }
            lastClickTime = currentTime;
            createClickEffect(e);
            updateDisplays();
        }
    });

    function createClickEffect(e) {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.left = `${e.clientX - e.target.offsetLeft}px`;
        circle.style.top = `${e.clientY - e.target.offsetTop}px`;
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'rgba(255,255,255,0.5)';
        circle.style.transform = 'translate(-50%, -50%) scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        
        e.target.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    }

    function createComboText(e) {
        const comboText = document.createElement('div');
        comboText.textContent = `${combo}x Combo!`;
        comboText.style.position = 'absolute';
        comboText.style.left = `${e.clientX - e.target.offsetLeft}px`;
        comboText.style.top = `${e.clientY - e.target.offsetTop - 20}px`;
        comboText.style.color = '#fff';
        comboText.style.fontSize = '20px';
        comboText.style.fontWeight = 'bold';
        comboText.style.animation = 'floatUp 0.8s ease-out';
        comboText.style.pointerEvents = 'none';

        e.target.appendChild(comboText);
        setTimeout(() => comboText.remove(), 800);
    }

    function startGame() {
        isGameRunning = true;
        clickCount = 0;
        timeLeft = startTime;
        combo = 0;
        updateDisplays();
        
        timer = setInterval(() => {
            timeLeft -= 0.1;
            if (timeLeft <= 0) {
                endGame();
            } else {
                updateDisplays();
            }
        }, 100);
    }

    function endGame() {
        clearInterval(timer);
        isGameRunning = false;
        const cps = (clickCount/startTime).toFixed(2);
        
        if (cps > highScore) {
            highScore = cps;
            localStorage.setItem('highScore', highScore);
        }

        showWinScreen(cps);
    }

    function showWinScreen(cps) {
        const winScreen = document.createElement('div');
        winScreen.className = 'win-screen';
        
        let rating = getRating(cps);
        let message = getMotivationalMessage(cps);

        winScreen.innerHTML = `
            <h2>${rating}</h2>
            <p style="animation-delay: 0.2s">Your CPS: ${cps}</p>
            <p style="animation-delay: 0.4s">Total Clicks: ${clickCount}</p>
            <p style="animation-delay: 0.6s">High Score: ${highScore}</p>
            <p style="animation-delay: 0.8s">${message}</p>
            <button id="play-again">Play Again</button>
        `;

        gameContainer.innerHTML = '';
        gameContainer.appendChild(winScreen);

        document.getElementById('play-again').addEventListener('click', resetGame);
    }

    function getRating(cps) {
        if (cps >= 12) return "🏆 LEGENDARY!";
        if (cps >= 10) return "⭐ INCREDIBLE!";
        if (cps >= 8) return "🌟 AMAZING!";
        if (cps >= 6) return "👍 GREAT!";
        if (cps >= 4) return "😊 GOOD!";
        return "🎯 KEEP GOING!";
    }

    function getMotivationalMessage(cps) {
        if (cps >= 12) return "You're absolutely unstoppable!";
        if (cps >= 10) return "Nearly perfect! Can you go even faster?";
        if (cps >= 8) return "You're getting really good at this!";
        if (cps >= 6) return "Nice rhythm! Keep it up!";
        if (cps >= 4) return "You're improving! Don't give up!";
        return "Practice makes perfect! Try again!";
    }

    function resetGame() {
        clearInterval(timer);
        isGameRunning = false;
        clickCount = 0;
        timeLeft = startTime;
        combo = 0;
        
        gameContainer.innerHTML = `
            <div class="box"></div>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        `;
        
        document.querySelector('.box').addEventListener('click', function(e) {
            if (!isGameRunning) {
                startGame();
            }
            if (isGameRunning) {
                clickCount++;
                createClickEffect(e);
                updateDisplays();
            }
        });
        
        updateDisplays();
    }
});
