document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const personalForm = document.getElementById('personalForm');
    const vehicleForm = document.getElementById('vehicleForm');
    const documentsForm = document.getElementById('documentsForm');
    const reviewForm = document.getElementById('reviewInfo');

    const personalInfo = document.getElementById('personalInfo');
    const vehicleInfo = document.getElementById('vehicleInfo');
    const documentsInfo = document.getElementById('documentsInfo');
    const reviewInfo = document.getElementById('reviewInfo');
    const confirmationInfo = document.getElementById('confirmationInfo');

    const progressSteps = document.querySelectorAll('.progress-step');

    // Dados do formulário
    let formData = {
        personal: {},
        vehicle: {},
        documents: {}
    };

    let currentStep = 1;
    const totalSteps = 4;

    // Configurar máscaras de input
    setupInputMasks();

    // Configurar listeners dos formulários
    setupFormListeners();

    // Configurar listeners de arquivos
    setupFileListeners();

    // Função para configurar máscaras de input
    function setupInputMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            }
        });

        // Máscara para telefone
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });

        // Máscara para placa
        const licensePlateInput = document.getElementById('licensePlate');
        licensePlateInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase();
            if (value.length <= 7) {
                if (value.length <= 3) {
                    value = value.replace(/([A-Z]{3})/, '$1');
                } else if (value.length <= 6) {
                    value = value.replace(/([A-Z]{3})(\d{3})/, '$1-$2');
                } else {
                    value = value.replace(/([A-Z]{3})(\d{3})([A-Z0-9])/, '$1-$2$3');
                }
                e.target.value = value;
            }
        });
    }

    // Função para configurar listeners dos formulários
    function setupFormListeners() {
        // Formulário de informações pessoais
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validatePersonalForm()) {
                collectPersonalData();
                showNextStep(2);
            }
        });

        // Formulário de informações do veículo
        vehicleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateVehicleForm()) {
                collectVehicleData();
                showNextStep(3);
            }
        });

        // Formulário de documentos
        documentsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateDocumentsForm()) {
                collectDocumentsData();
                showNextStep(4);
            }
        });

        // Formulário de revisão
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateReviewForm()) {
                submitRegistration();
            }
        });
    }

    // Função para configurar listeners de arquivos
    function setupFileListeners() {
        const fileInputs = document.querySelectorAll('.file-input');

        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    updateFileLabel(this, file.name);
                    validateFileSize(file, this);
                }
            });
        });
    }

    // Função para atualizar label do arquivo
    function updateFileLabel(input, fileName) {
        const label = input.nextElementSibling;
        const uploadText = label.querySelector('.upload-text');
        uploadText.textContent = fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;

        // Adicionar classe para indicar arquivo selecionado
        label.classList.add('file-selected');
    }

    // Função para validar tamanho do arquivo
    function validateFileSize(file, input) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showMessage('Arquivo muito grande. Tamanho máximo: 5MB', 'error');
            input.value = '';
            const label = input.nextElementSibling;
            const uploadText = label.querySelector('.upload-text');
            uploadText.textContent = input.getAttribute('data-original-text') || 'Selecionar Arquivo';
            label.classList.remove('file-selected');
        }
    }

    // Função para validar formulário pessoal
    function validatePersonalForm() {
        const requiredFields = ['fullName', 'cpf', 'email', 'phone', 'birthDate'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();

            if (!value) {
                showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else if (fieldId === 'email' && !isValidEmail(value)) {
                showFieldError(field, 'E-mail inválido');
                isValid = false;
            } else if (fieldId === 'cpf' && !isValidCPF(value)) {
                showFieldError(field, 'CPF inválido');
                isValid = false;
            } else if (fieldId === 'phone' && !isValidPhone(value)) {
                showFieldError(field, 'Telefone inválido');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        return isValid;
    }

    // Função para validar formulário do veículo
    function validateVehicleForm() {
        const requiredFields = ['vehicleBrand', 'vehicleModel', 'vehicleYear', 'vehicleColor', 'licensePlate'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();

            if (!value) {
                showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else if (fieldId === 'vehicleYear') {
                const year = parseInt(value);
                if (year < 1990 || year > 2025) {
                    showFieldError(field, 'Ano deve estar entre 1990 e 2025');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            } else if (fieldId === 'licensePlate' && !isValidLicensePlate(value)) {
                showFieldError(field, 'Placa inválida');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        return isValid;
    }

    // Função para validar formulário de documentos
    function validateDocumentsForm() {
        const requiredFiles = ['cnhFront', 'cnhBack', 'vehicleDoc', 'residenceProof', 'identityDoc'];
        let isValid = true;

        requiredFiles.forEach(fileId => {
            const fileInput = document.getElementById(fileId);
            if (!fileInput.files[0]) {
                showFieldError(fileInput, 'Este documento é obrigatório');
                isValid = false;
            } else {
                clearFieldError(fileInput);
            }
        });

        return isValid;
    }

    // Função para validar formulário de revisão
    function validateReviewForm() {
        const termsAccept = document.getElementById('termsAccept');
        const dataConsent = document.getElementById('dataConsent');

        if (!termsAccept.checked || !dataConsent.checked) {
            showMessage('Você deve aceitar os termos e condições', 'error');
            return false;
        }

        return true;
    }

    // Funções de validação específicas
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
    }

    function isValidPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    function isValidLicensePlate(plate) {
        const cleanPlate = plate.replace(/[^A-Z0-9]/g, '');
        return cleanPlate.length === 7;
    }

    // Função para mostrar erro no campo
    function showFieldError(field, message) {
        clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';

        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#e74c3c';
    }

    // Função para limpar erro do campo
    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '#e1e5e9';
    }

    // Função para coletar dados pessoais
    function collectPersonalData() {
        formData.personal = {
            fullName: document.getElementById('fullName').value.trim(),
            cpf: document.getElementById('cpf').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value
        };
    }

    // Função para coletar dados do veículo
    function collectVehicleData() {
        formData.vehicle = {
            brand: document.getElementById('vehicleBrand').value.trim(),
            model: document.getElementById('vehicleModel').value.trim(),
            year: document.getElementById('vehicleYear').value,
            color: document.getElementById('vehicleColor').value.trim(),
            licensePlate: document.getElementById('licensePlate').value.trim(),
            type: document.getElementById('vehicleType').value
        };
    }

    // Função para coletar dados dos documentos
    function collectDocumentsData() {
        formData.documents = {
            cnhFront: document.getElementById('cnhFront').files[0]?.name || '',
            cnhBack: document.getElementById('cnhBack').files[0]?.name || '',
            vehicleDoc: document.getElementById('vehicleDoc').files[0]?.name || '',
            residenceProof: document.getElementById('residenceProof').files[0]?.name || '',
            identityDoc: document.getElementById('identityDoc').files[0]?.name || ''
        };
    }

    // Função para mostrar próxima etapa
    function showNextStep(step) {
        // Ocultar etapa atual
        const currentSection = getSectionByStep(currentStep);
        currentSection.classList.add('hidden');

        // Mostrar próxima etapa
        const nextSection = getSectionByStep(step);
        nextSection.classList.remove('hidden');

        // Atualizar progresso
        updateProgress(step);

        // Atualizar etapa atual
        currentStep = step;

        // Se for a etapa de revisão, preencher dados
        if (step === 4) {
            populateReviewData();
        }

        // Scroll para a nova seção
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Função para mostrar etapa anterior
    window.showPreviousStep = function() {
        if (currentStep > 1) {
            showNextStep(currentStep - 1);
        }
    };

    // Função para obter seção por etapa
    function getSectionByStep(step) {
        const sections = {
            1: personalInfo,
            2: vehicleInfo,
            3: documentsInfo,
            4: reviewInfo,
            5: confirmationInfo
        };
        return sections[step];
    }

    // Função para atualizar progresso visual
    function updateProgress(step) {
        progressSteps.forEach((stepElement, index) => {
            const stepNumber = index + 1;

            if (stepNumber < step) {
                stepElement.classList.add('completed');
                stepElement.classList.remove('active');
            } else if (stepNumber === step) {
                stepElement.classList.add('active');
                stepElement.classList.remove('completed');
            } else {
                stepElement.classList.remove('active', 'completed');
            }
        });
    }

    // Função para preencher dados de revisão
    function populateReviewData() {
        // Informações pessoais
        const personalReview = document.getElementById('personalReview');
        personalReview.innerHTML = `
            <div class="review-item">
                <div class="review-label">Nome Completo</div>
                <div class="review-value">${formData.personal.fullName}</div>
            </div>
            <div class="review-item">
                <div class="review-label">CPF</div>
                <div class="review-value">${formData.personal.cpf}</div>
            </div>
            <div class="review-item">
                <div class="review-label">E-mail</div>
                <div class="review-value">${formData.personal.email}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Telefone</div>
                <div class="review-value">${formData.personal.phone}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Data de Nascimento</div>
                <div class="review-value">${formatDate(formData.personal.birthDate)}</div>
            </div>
            ${formData.personal.gender ? `<div class="review-item">
                <div class="review-label">Gênero</div>
                <div class="review-value">${formatGender(formData.personal.gender)}</div>
            </div>` : ''}
        `;

        // Informações do veículo
        const vehicleReview = document.getElementById('vehicleReview');
        vehicleReview.innerHTML = `
            <div class="review-item">
                <div class="review-label">Marca</div>
                <div class="review-value">${formData.vehicle.brand}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Modelo</div>
                <div class="review-value">${formData.vehicle.model}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Ano</div>
                <div class="review-value">${formData.vehicle.year}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Cor</div>
                <div class="review-value">${formData.vehicle.color}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Placa</div>
                <div class="review-value">${formData.vehicle.licensePlate}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Tipo</div>
                <div class="review-value">${formatVehicleType(formData.vehicle.type)}</div>
            </div>
        `;

        // Documentos
        const documentsReview = document.getElementById('documentsReview');
        documentsReview.innerHTML = `
            <div class="review-item">
                <div class="review-label">CNH Frente</div>
                <div class="review-value">${formData.documents.cnhFront}</div>
            </div>
            <div class="review-item">
                <div class="review-label">CNH Verso</div>
                <div class="review-value">${formData.documents.cnhBack}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Documento do Veículo</div>
                <div class="review-value">${formData.documents.vehicleDoc}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Comprovante de Residência</div>
                <div class="review-value">${formData.documents.residenceProof}</div>
            </div>
            <div class="review-item">
                <div class="review-label">Documento de Identidade</div>
                <div class="review-value">${formData.documents.identityDoc}</div>
            </div>
        `;
    }

    // Função para formatar data
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Função para formatar gênero
    function formatGender(gender) {
        const genders = {
            'masculino': 'Masculino',
            'feminino': 'Feminino',
            'outro': 'Outro',
            'prefiro-nao-dizer': 'Prefiro não dizer'
        };
        return genders[gender] || gender;
    }

    // Função para formatar tipo de veículo
    function formatVehicleType(type) {
        const types = {
            'sedan': 'Sedan',
            'hatchback': 'Hatchback',
            'suv': 'SUV',
            'pickup': 'Pickup',
            'van': 'Van'
        };
        return types[type] || type;
    }

    // Função para enviar cadastro
    function submitRegistration() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Simular envio
        setTimeout(() => {
            showMessage('Cadastro enviado com sucesso!', 'success');

            setTimeout(() => {
                showNextStep(5);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        }, 2000);
    }

    // Função para resetar formulário
    window.resetForm = function() {
        // Limpar dados
        formData = { personal: {}, vehicle: {}, documents: {} };

        // Resetar formulários
        personalForm.reset();
        vehicleForm.reset();
        documentsForm.reset();

        // Limpar arquivos selecionados
        const fileLabels = document.querySelectorAll('.file-label');
        fileLabels.forEach(label => {
            label.classList.remove('file-selected');
            const uploadText = label.querySelector('.upload-text');
            const originalText = label.querySelector('.file-input').getAttribute('data-original-text');
            uploadText.textContent = originalText || 'Selecionar Arquivo';
        });

        // Voltar para primeira etapa
        showNextStep(1);

        // Limpar erros
        const errorFields = document.querySelectorAll('.field-error');
        errorFields.forEach(error => error.remove());

        // Resetar progresso
        updateProgress(1);
    };

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

    // Adicionar estilos para mensagens e erros
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
            border-left: 4px solid #28a745;
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

        .file-selected {
            background: rgba(40, 167, 69, 0.1) !important;
            border-color: #28a745 !important;
        }

        .file-selected .upload-text {
            color: #28a745 !important;
        }

        .field-error {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);

    // Inicializar
    updateProgress(1);
});
