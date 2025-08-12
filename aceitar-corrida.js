document.addEventListener('DOMContentLoaded', function() {
    const ridesContainer = document.getElementById('ridesContainer');
    const confirmationSection = document.getElementById('confirmationSection');
    const tripSection = document.getElementById('tripSection');
    const sliderThumb = document.getElementById('sliderThumb');
    const sliderTrack = document.getElementById('sliderTrack');
    const statusSteps = document.querySelectorAll('.status-step');

    let currentStep = 1;
    let acceptedRide = null;
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    let tripTimer = null;
    let tripStartTime = null;

    // Dados simulados das corridas disponíveis
    const availableRides = [
        {
            id: 1,
            origin: 'Rua das Flores, 123',
            destination: 'Shopping Center',
            time: '15 min',
            distance: '3.2 km',
            gain: 'R$ 12,50',
            passenger: {
                name: 'Ana Silva',
                rating: 4.8,
                avatar: '👩'
            }
        },
        {
            id: 2,
            origin: 'Avenida Principal, 456',
            destination: 'Universidade Federal',
            time: '20 min',
            distance: '4.1 km',
            gain: 'R$ 15,00',
            passenger: {
                name: 'João Pedro',
                rating: 4.9,
                avatar: '👨'
            }
        },
        {
            id: 3,
            origin: 'Rua do Comércio, 789',
            destination: 'Hospital Municipal',
            time: '12 min',
            distance: '2.8 km',
            gain: 'R$ 10,00',
            passenger: {
                name: 'Maria Santos',
                rating: 4.7,
                avatar: '👵'
            }
        }
    ];

    // Renderizar corridas disponíveis
    function renderRides() {
        ridesContainer.innerHTML = '';
        availableRides.forEach(ride => {
            const rideCard = document.createElement('div');
            rideCard.className = 'ride-card';
            rideCard.setAttribute('data-ride-id', ride.id);

            rideCard.innerHTML = `
                <div class="ride-header">
                    <span class="ride-status new">Nova</span>
                    <span class="ride-time">${ride.time}</span>
                </div>
                <div class="ride-route">
                    <div class="route-point origin">
                        <div class="point-icon">📍</div>
                        <div class="point-info">
                            <span class="point-label">Origem</span>
                            <span class="point-address">${ride.origin}</span>
                        </div>
                    </div>
                    <div class="route-point destination">
                        <div class="point-icon">🎯</div>
                        <div class="point-info">
                            <span class="point-label">Destino</span>
                            <span class="point-address">${ride.destination}</span>
                        </div>
                    </div>
                </div>
                <div class="ride-summary">
                    <div class="summary-item">
                        <span class="summary-label">Distância</span>
                        <span class="summary-value">${ride.distance}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Ganho</span>
                        <span class="summary-value gain">${ride.gain}</span>
                    </div>
                </div>
                <div class="passenger-info">
                    <div class="passenger-avatar">${ride.passenger.avatar}</div>
                    <div class="passenger-details">
                        <span class="passenger-name">${ride.passenger.name}</span>
                        <span class="passenger-rating">⭐ ${ride.passenger.rating}</span>
                    </div>
                </div>
                <div class="ride-actions">
                    <button class="btn btn-primary accept-btn" onclick="acceptRide(${ride.id})">
                        ✅ Aceitar Corrida
                    </button>
                    <button class="btn btn-secondary" onclick="viewRideDetails(${ride.id})">
                        👁️ Ver Detalhes
                    </button>
                </div>
            `;

            ridesContainer.appendChild(rideCard);
        });
    }

    // Função para aceitar corrida
    window.acceptRide = function(rideId) {
        const ride = availableRides.find(r => r.id === rideId);
        if (!ride) return;

        acceptedRide = ride;
        showMessage(`Corrida aceita! ${ride.passenger.name} está aguardando.`, 'success');

        // Remover a corrida da lista
        const rideCard = document.querySelector(`[data-ride-id="${rideId}"]`);
        rideCard.style.opacity = '0.5';
        rideCard.style.pointerEvents = 'none';

        // Mostrar seção de confirmação
        setTimeout(() => {
            confirmationSection.style.display = 'block';
            confirmationSection.scrollIntoView({ behavior: 'smooth' });
            updateStatus(2);
        }, 1000);
    };

    // Função para ver detalhes da corrida
    window.viewRideDetails = function(rideId) {
        const ride = availableRides.find(r => r.id === rideId);
        if (!ride) return;

        showMessage(`Detalhes da corrida: ${ride.origin} → ${ride.destination}`, 'info');
    };

    // Configurar slider de confirmação
    function setupSlider() {
        sliderThumb.addEventListener('mousedown', startDragging);
        sliderThumb.addEventListener('touchstart', startDragging);

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    }

    function startDragging(e) {
        isDragging = true;
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        startX = clientX;
        startLeft = sliderThumb.offsetLeft;

        sliderThumb.style.transition = 'none';
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = clientX - startX;
        const newLeft = Math.max(0, Math.min(startLeft + deltaX, sliderTrack.offsetWidth - sliderThumb.offsetWidth));

        sliderThumb.style.left = newLeft + 'px';

        // Atualizar preenchimento do slider
        const progress = newLeft / (sliderTrack.offsetWidth - sliderThumb.offsetWidth);
        sliderTrack.style.setProperty('--slider-progress', progress);

        // Verificar se chegou ao final
        if (progress >= 0.95) {
            confirmRide();
        }
    }

    function stopDragging() {
        if (!isDragging) return;

        isDragging = false;
        sliderThumb.style.transition = 'left 0.3s ease';

        // Retornar ao início se não chegou ao final
        if (parseFloat(sliderThumb.style.left) < sliderTrack.offsetWidth - sliderThumb.offsetWidth - 10) {
            sliderThumb.style.left = '0px';
            sliderTrack.style.setProperty('--slider-progress', 0);
        }
    }

    // Função para confirmar corrida
    function confirmRide() {
        showMessage('Corrida confirmada! Iniciando trajeto...', 'success');

        setTimeout(() => {
            confirmationSection.style.display = 'none';
            tripSection.style.display = 'block';
            tripSection.scrollIntoView({ behavior: 'smooth' });
            updateStatus(3);
            startTrip();
        }, 1500);
    }

    // Função para iniciar o trajeto
    function startTrip() {
        tripStartTime = Date.now();
        updateTripTimer();
        tripTimer = setInterval(updateTripTimer, 1000);

        // Simular atualizações do trajeto
        setTimeout(() => {
            showMessage('Chegando ao ponto de partida...', 'info');
        }, 3000);

        setTimeout(() => {
            showMessage('Passageiro embarcado! Iniciando viagem...', 'success');
        }, 8000);
    }

    // Função para atualizar timer do trajeto
    function updateTripTimer() {
        if (!tripStartTime) return;

        const elapsed = Math.floor((Date.now() - tripStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        const timerElement = document.querySelector('.trip-timer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Funções para os botões de ação do trajeto
    window.startNavigation = function() {
        showMessage('Navegação iniciada! Siga as instruções do GPS.', 'info');
    };

    window.contactPassenger = function() {
        showMessage('Ligando para o passageiro...', 'info');
        setTimeout(() => {
            showMessage('Chamada conectada!', 'success');
        }, 2000);
    };

    window.arrivedAtPickup = function() {
        showMessage('Chegou ao ponto de partida! Aguardando passageiro.', 'success');
    };

    // Função para atualizar status visual
    function updateStatus(step) {
        statusSteps.forEach((stepElement, index) => {
            if (index + 1 < step) {
                stepElement.classList.add('completed');
                stepElement.classList.remove('active');
            } else if (index + 1 === step) {
                stepElement.classList.add('active');
                stepElement.classList.remove('completed');
            } else {
                stepElement.classList.remove('active', 'completed');
            }
        });
        currentStep = step;
    }

    // Função para mostrar mensagens
    function showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `message-toast ${type}`;
        message.innerHTML = `
            <span class="message-icon">${getMessageIcon(type)}</span>
            <span class="message-text">${text}</span>
        `;

        document.body.appendChild(message);

        // Animar entrada
        setTimeout(() => message.classList.add('show'), 100);

        // Remover após 4 segundos
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }, 4000);
    }

    // Função para obter ícone da mensagem
    function getMessageIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }

    // Inicializar
    renderRides();
    setupSlider();
    updateStatus(1);

    // Adicionar estilos para as mensagens
    const style = document.createElement('style');
    style.textContent = `
        .message-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }

        .message-toast.show {
            transform: translateX(0);
        }

        .message-toast.success {
            border-left: 4px solid #27ae60;
            background: #f8fff9;
        }

        .message-toast.error {
            border-left: 4px solid #e74c3c;
            background: #fff8f8;
        }

        .message-toast.info {
            border-left: 4px solid #3498db;
            background: #f8fbff;
        }

        .message-toast.warning {
            border-left: 4px solid #f39c12;
            background: #fffbf8;
        }

        .message-icon {
            font-size: 18px;
        }

        .message-text {
            font-size: 14px;
            color: #333;
        }
    `;
    document.head.appendChild(style);
});
