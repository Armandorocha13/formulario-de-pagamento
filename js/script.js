document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do DOM
    const qrCodeContainer = document.getElementById('qr-code');
    const cardForm = document.querySelector('.payment-form form');
    const radioButtons = document.querySelectorAll('input[name="payment"]');
    const copyButton = document.getElementById('codigo');
    const pixCodeTextarea = document.getElementById('copiaecola');
    const descriptionPrice = document.querySelector('.description-price');
    const installmentsInput = document.getElementById('installments');
    const priceElement = document.getElementById('price');
    const formInputs = document.querySelectorAll('.payment-form form input, .payment-form form select');
    const submitButton = document.getElementById('comprar');
    const messageContainer = document.getElementById('message-container');
    const loadingOverlay = document.querySelector('.loading-overlay');

    let basePrice = 1000;

    // Função para gerar um código aleatório
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    // Função para gerar a URL do QR Code
    function generateQRCode(text, size = 150) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    }

    // Função para mostrar ou ocultar o QR Code e o formulário de pagamento com cartão
    function togglePaymentOptions() {
        if (document.getElementById('pix').checked) {
            const randomCode = generateRandomCode(422);
            pixCodeTextarea.value = randomCode; 
            const qrCodeUrl = generateQRCode(randomCode);

            const existingImg = qrCodeContainer.querySelector('img');
            if (existingImg) {
                qrCodeContainer.removeChild(existingImg);
            }

            const qrCodeImg = document.createElement('img');
            qrCodeImg.src = qrCodeUrl;
            qrCodeImg.alt = 'QR Code';
            qrCodeImg.style.width = '210px';
            qrCodeImg.style.display = 'block';
            qrCodeImg.style.marginRight = '80px';
            qrCodeContainer.appendChild(qrCodeImg);

            qrCodeContainer.style.display = 'flex';
            qrCodeContainer.style.flexDirection = 'column';
            qrCodeContainer.style.alignItems = 'center';

            cardForm.style.display = 'none';

            if (descriptionPrice) {
                descriptionPrice.style.display = 'none';
            }
        } else {
            qrCodeContainer.style.display = 'none';
            cardForm.style.display = 'block';

            if (descriptionPrice) {
                descriptionPrice.style.display = 'block';
            }
        }

        pixCodeTextarea.style.marginTop = '10px';
        pixCodeTextarea.style.marginBottom = '10px';
        pixCodeTextarea.style.width = '50%';
        pixCodeTextarea.style.padding = '10px';
        pixCodeTextarea.style.marginRight = '100px';

        copyButton.style.margin = '10px auto';
        copyButton.style.cursor = 'pointer';
        copyButton.style.display = 'block';
        copyButton.style.marginRight = '350px';
    }

    // Função para calcular o preço com base no número de parcelas
    function calculatePrice() {
        const installments = parseInt(installmentsInput.value, 10);
        if (isNaN(installments) || installments <= 0) {
            priceElement.textContent = 'Preço: R$ ' + basePrice.toFixed(2);
            return;
        }

        const interestRate = 0.003; // 0.3%
        const totalPrice = basePrice * (1 + (interestRate * installments));
        priceElement.textContent = 'Preço: R$ ' + totalPrice.toFixed(1);
    }

    // Função para validar o formulário
    function validateForm() {
        let isValid = true;
        formInputs.forEach(input => {
            if ((input.type === 'text' || input.type === 'number') && input.value.trim() === '') {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }

            if (input.tagName === 'SELECT' && input.value === '') {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        return isValid;
    }

    // Função para simular a análise de crédito
    function analyzeCredit() {
        return Math.random() > 0.5; // Simulação aleatória (50% de chance de aprovação)
    }

    // Função para exibir mensagem de aprovação ou reprovação
    function showMessage(isApproved) {
        messageContainer.textContent = isApproved ? 'Compra Aprovada!' : 'Compra Reprovada!';
        messageContainer.className = `message-container ${isApproved ? 'approved' : 'rejected'} show`;

        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 3000); // A mensagem desaparece após 3 segundos
    }

    // Função para exibir a tela de carregamento
    function showLoading() {
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 3000); // Oculta após 3 segundos
    }

    // Função para exibir alerta ao clicar no botão "comprar"
    function handleSubmit() {
        if (validateForm()) {
            showLoading(); // Mostra a tela de carregamento

            // Simula um atraso para a análise de crédito
            setTimeout(() => {
                if (analyzeCredit()) {
                    showMessage(true);
                } else {
                    showMessage(false);
                }
            }, 3000); // Simula o tempo de processamento da análise de crédito
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    }

    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }

    if (installmentsInput) {
        installmentsInput.addEventListener('input', calculatePrice);
    }

    radioButtons.forEach(button => {
        button.addEventListener('change', togglePaymentOptions);
    });

    function preencherInputs() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'email' || input.type === 'number') {
                input.value = 'Exemplo';
            }
            if (input.type === 'radio') {
                input.checked = false;
            }
        });

        const defaultRadio = document.querySelector('input[name="payment"][value="pix"]');
        if (defaultRadio) {
            defaultRadio.checked = false;
        }

        togglePaymentOptions();
    }

    function copyPixCode() {
        pixCodeTextarea.select();
        document.execCommand('copy');
        alert('Código PIX copiado para a área de transferência!');
    }

    copyButton.addEventListener('click', copyPixCode);

    togglePaymentOptions();
    preencherInputs();
    calculatePrice();
});
