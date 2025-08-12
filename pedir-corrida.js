// JavaScript para implementar a interação semiótica em Pedir Corrida
// Seguindo os princípios da Engenharia Semiótica

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const destinationInput = document.getElementById('destination');
    const searchBtn = document.querySelector('.search-btn');
    const routeSection = document.getElementById('routeSection');
    const driverSection = document.getElementById('driverSection');
    const confirmBtn = document.getElementById('confirmBtn');
    const destDisplay = document.getElementById('destDisplay');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Estado da aplicação
    let currentStep = 1;
    let destination = '';

    // S-01: Buscar destino - Implementa o signo semiótico de busca
    searchBtn.addEventListener('click', function() {
        destination = destinationInput.value.trim();

        if (destination === '') {
            showMessage('Por favor, digite um destino válido', 'error');
            return;
        }

        // Simula busca de rota
        showMessage('Buscando rota...', 'info');

        setTimeout(() => {
            // Atualiza o display do destino
            destDisplay.textContent = destination;

            // Mostra a seção de rota (S-02)
            routeSection.style.display = 'block';

            // Atualiza progresso
            updateProgress(2);

            // Scroll suave para a nova seção
            routeSection.scrollIntoView({ behavior: 'smooth' });

            showMessage('Rota encontrada! Confirme os detalhes.', 'success');
        }, 2000);
    });

    // S-02: Confirmar corrida - Implementa o signo semiótico de confirmação
    confirmBtn.addEventListener('click', function() {
        showMessage('Confirmando corrida...', 'info');

        setTimeout(() => {
            // Simula busca de motorista
            showMessage('Procurando motorista disponível...', 'info');

            setTimeout(() => {
                // Mostra a seção do motorista (S-03)
                driverSection.style.display = 'block';

                // Atualiza progresso
                updateProgress(3);

                // Scroll suave para a nova seção
                driverSection.scrollIntoView({ behavior: 'smooth' });

                showMessage('Motorista encontrado! Ele está a caminho.', 'success');

                // Simula atualização em tempo real
                startDriverUpdates();
            }, 3000);
        }, 1500);
    });

    // Função para atualizar o indicador de progresso semiótico
    function updateProgress(step) {
        progressSteps.forEach((stepElement, index) => {
            const stepNumber = index + 1;

            if (stepNumber < step) {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
            } else if (stepNumber === step) {
                stepElement.classList.remove('completed');
                stepElement.classList.add('active');
            } else {
                stepElement.classList.remove('active', 'completed');
            }
        });

        currentStep = step;
    }

    // Função para mostrar mensagens de feedback semiótico
    function showMessage(text, type) {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.innerHTML = `
            <span class="message-icon">${getMessageIcon(type)}</span>
            <span class="message-text">${text}</span>
        `;

        // Adiciona estilos inline para garantir visibilidade
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
            ${getMessageStyles(type)}
        `;

        document.body.appendChild(message);

        // Remove a mensagem após 4 segundos
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 300);
        }, 4000);
    }

    // Função para obter ícone da mensagem baseado no tipo
    function getMessageIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'info': 'ℹ️',
            'warning': '⚠️'
        };
        return icons[type] || icons.info;
    }

    // Função para obter estilos da mensagem baseado no tipo
    function getMessageStyles(type) {
        const styles = {
            'success': 'background: #27ae60;',
            'error': 'background: #e74c3c;',
            'info': 'background: #3498db;',
            'warning': 'background: #f39c12;'
        };
        return styles[type] || styles.info;
    }

    // Função para simular atualizações em tempo real do motorista
    function startDriverUpdates() {
        let timeLeft = 3;

        const updateInterval = setInterval(() => {
            timeLeft--;

            if (timeLeft <= 0) {
                clearInterval(updateInterval);
                showMessage('Motorista chegou! Boa viagem!', 'success');

                // Atualiza o status
                const statusElement = document.querySelector('.status-item:first-child span:last-child');
                if (statusElement) {
                    statusElement.innerHTML = '<strong>Chegou!</strong>';
                }
            } else {
                // Atualiza o tempo restante
                const statusElement = document.querySelector('.status-item:first-child span:last-child');
                if (statusElement) {
                    statusElement.innerHTML = `<strong>${timeLeft} min</strong>`;
                }
            }
        }, 60000); // Atualiza a cada minuto
    }

    // Validação em tempo real do input
    destinationInput.addEventListener('input', function() {
        const value = this.value.trim();

        if (value.length > 0) {
            searchBtn.disabled = false;
            searchBtn.style.opacity = '1';
        } else {
            searchBtn.disabled = true;
            searchBtn.style.opacity = '0.6';
        }
    });

    // Suporte a Enter para buscar
    destinationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Adiciona estilos CSS para as mensagens
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .search-btn:disabled {
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // Inicialização: desabilita o botão de busca
    searchBtn.disabled = true;
    searchBtn.style.opacity = '0.6';
});
