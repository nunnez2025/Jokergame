
        // Initialize game
        document.addEventListener('DOMContentLoaded', function() {
            initializeGame();
        });

        // Game State
        const gameState = {
            reputation: 100,
            bits: 500,
            level: 1,
            energy: 80,
            skills: {
                speed: 1,
                logic: 1,
                memory: 1
            },
            invasao: {
                level: 1,
                sequenceLength: 3,
                currentSequence: [],
                userSequence: [],
                showingSequence: false,
                activeIndex: -1
            }
        };

        // Initialize Game
        function initializeGame() {
            updateHUD();
            showNotification("Bem-vindo ao teste de invasão, Coringa!", "success");
        }

        // Update HUD
        function updateHUD() {
            document.getElementById('reputation').textContent = gameState.reputation;
            document.getElementById('bits').textContent = gameState.bits;
            document.getElementById('level').textContent = gameState.level;
            document.getElementById('energy-bar').style.width = gameState.energy + '%';
            
            // Update skill bars
            document.getElementById('speed-bar').style.width = (gameState.skills.speed * 10) + '%';
            document.getElementById('logic-bar').style.width = (gameState.skills.logic * 10) + '%';
            document.getElementById('memory-bar').style.width = (gameState.skills.memory * 10) + '%';
            
            document.getElementById('speed-level').textContent = gameState.skills.speed;
            document.getElementById('logic-level').textContent = gameState.skills.logic;
            document.getElementById('memory-level').textContent = gameState.skills.memory;
        }

        // Show Section
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId + '-section').classList.add('active');
            
            // Update HUD
            updateHUD();
        }

        // Invasao Game Functions
        function startInvasao() {
            if (gameState.invasao.showingSequence) return;
            
            document.getElementById('start-invasao-btn').disabled = true;
            document.getElementById('game-status').textContent = "Memorize o protocolo de invasão...";
            
            // Generate new sequence
            gameState.invasao.currentSequence = [];
            const symbols = ['▲', '●', '■', '♦'];
            
            for (let i = 0; i < gameState.invasao.sequenceLength; i++) {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                gameState.invasao.currentSequence.push(randomSymbol);
            }
            
            // Display sequence
            showSequence();
        }

        function showSequence() {
            gameState.invasao.showingSequence = true;
            gameState.invasao.userSequence = [];
            const display = document.getElementById('sequence-display');
            
            // Clear display
            display.innerHTML = '';
            
            // Create sequence items
            gameState.invasao.currentSequence.forEach((symbol, index) => {
                const item = document.createElement('div');
                item.className = 'sequence-item';
                item.textContent = '?';
                item.id = `seq-item-${index}`;
                display.appendChild(item);
            });
            
            // Show symbols one by one
            let i = 0;
            const showInterval = setInterval(() => {
                if (i < gameState.invasao.currentSequence.length) {
                    const item = document.getElementById(`seq-item-${i}`);
                    item.textContent = gameState.invasao.currentSequence[i];
                    item.classList.add('active');
                    
                    setTimeout(() => {
                        item.classList.remove('active');
                        i++;
                    }, 500);
                } else {
                    clearInterval(showInterval);
                    setTimeout(() => {
                        // Hide symbols
                        const items = display.querySelectorAll('.sequence-item');
                        items.forEach(item => {
                            item.textContent = '?';
                        });
                        
                        gameState.invasao.showingSequence = false;
                        document.getElementById('game-status').textContent = "Repita o protocolo tocando nos símbolos";
                        document.getElementById('start-invasao-btn').disabled = false;
                    }, 1000);
                }
            }, 1000);
        }

        function selectSymbol(symbol) {
            if (gameState.invasao.showingSequence) return;
            if (gameState.invasao.userSequence.length >= gameState.invasao.currentSequence.length) return;
            
            // Add to user sequence
            gameState.invasao.userSequence.push(symbol);
            
            // Update display
            const currentIndex = gameState.invasao.userSequence.length - 1;
            if (currentIndex < gameState.invasao.sequenceLength) {
                const item = document.getElementById(`seq-item-${currentIndex}`);
                if (item) {
                    item.textContent = symbol;
                    item.classList.add('active');
                    setTimeout(() => {
                        item.classList.remove('active');
                    }, 300);
                }
            }
            
            // Check if sequence is complete
            if (gameState.invasao.userSequence.length === gameState.invasao.currentSequence.length) {
                checkSequence();
            }
        }

        function checkSequence() {
            const isCorrect = JSON.stringify(gameState.invasao.userSequence) === 
                             JSON.stringify(gameState.invasao.currentSequence);
            
            if (isCorrect) {
                document.getElementById('game-status').textContent = "Protocolo executado com sucesso!";
                gameState.invasao.level++;
                gameState.invasao.sequenceLength = Math.min(gameState.invasao.level + 2, 5);
                gameState.bits += gameState.invasao.level * 10;
                gameState.reputation += 5;
                updateHUD();
                showNotification(`Nível ${gameState.invasao.level} completo! +${gameState.invasao.level * 10} bits`, "success");
            } else {
                document.getElementById('game-status').textContent = "Falha no protocolo! Tente novamente.";
                showNotification("Sequência incorreta! Tente novamente.", "error");
            }
            
            // Update level display
            document.getElementById('invasao-level').textContent = gameState.invasao.level;
            document.getElementById('sequence-length').textContent = gameState.invasao.sequenceLength;
        }

        function resetInvasao() {
            gameState.invasao.level = 1;
            gameState.invasao.sequenceLength = 3;
            gameState.invasao.currentSequence = [];
            gameState.invasao.userSequence = [];
            gameState.invasao.showingSequence = false;
            
            document.getElementById('sequence-display').innerHTML = `
                <div class="sequence-item">?</div>
                <div class="sequence-item">?</div>
                <div class="sequence-item">?</div>
            `;
            
            document.getElementById('game-status').textContent = "Toque em INICIAR para começar";
            document.getElementById('invasao-level').textContent = gameState.invasao.level;
            document.getElementById('sequence-length').textContent = gameState.invasao.sequenceLength;
            document.getElementById('start-invasao-btn').disabled = false;
            
            showNotification("Teste reiniciado", "info");
        }

        // Show Notification
        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = 'notification show';
            
            if (type === 'success') {
                notification.style.borderColor = '#00ff00';
                notification.style.color = '#00ff00';
            } else if (type === 'error') {
                notification.style.borderColor = '#ff0000';
                notification.style.color = '#ff0000';
            } else {
                notification.style.borderColor = '#800080';
                notification.style.color = '#800080';
            }
            
            setTimeout(() => {
                notification.className = 'notification';
            }, 3000);
        }
    
