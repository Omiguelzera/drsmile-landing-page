// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Carrossel
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    // Formulário
    const contactForm = document.getElementById('contactForm');
    
    // Estado do carrossel
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.carousel-slide').length;
    
    // ==========================================
    // NAVBAR FUNCIONALIDADES
    // ==========================================
    
    // Toggle do menu mobile
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // ==========================================
    // NAVEGAÇÃO SUAVE
    // ==========================================
    
    // Smooth scroll para links internos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Altura do navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Atualizar link ativo
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Atualizar link ativo baseado no scroll
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // Detectar seção ativa durante o scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        if (current) {
            updateActiveNavLink(current);
        }
    });
    
    // ==========================================
    // CARROSSEL DE IMAGENS
    // ==========================================
    
    // Função para mostrar slide específico
    function showSlide(index) {
        // Garantir que o índice está no range válido
        if (index >= totalSlides) currentSlide = 0;
        if (index < 0) currentSlide = totalSlides - 1;
        
        // Mover o carrossel
        const translateX = -currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar indicadores
        updateIndicators();
        
        // Remover e adicionar classe active para animação suave
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
    }
    
    // Função para atualizar indicadores
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }
    
    // Botão próximo
    nextBtn.addEventListener('click', function() {
        currentSlide++;
        if (currentSlide >= totalSlides) currentSlide = 0;
        showSlide(currentSlide);
    });
    
    // Botão anterior
    prevBtn.addEventListener('click', function() {
        currentSlide--;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        showSlide(currentSlide);
    });
    
    // Indicadores clicáveis
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-play do carrossel (opcional)
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            currentSlide++;
            if (currentSlide >= totalSlides) currentSlide = 0;
            showSlide(currentSlide);
        }, 5000); // Muda a cada 5 segundos
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Iniciar auto-play
    startAutoSlide();
    
    // Pausar auto-play quando hover nos controles
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Navegação por teclado no carrossel
    document.addEventListener('keydown', function(e) {
        const carouselInView = isElementInViewport(carouselContainer);
        
        if (carouselInView) {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
    
    // ==========================================
    // FORMULÁRIO DE CONTATO
    // ==========================================
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Validação básica
        if (!validateForm(data)) {
            return;
        }
        
        // Simular envio do formulário
        submitForm(data);
    });
    
    // Função de validação
    function validateForm(data) {
        const requiredFields = ['name', 'email', 'phone', 'service'];
        let isValid = true;
        
        // Remover mensagens de erro existentes
        removeErrorMessages();
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = data[field];
            
            if (!value || value.trim() === '') {
                showFieldError(input, 'Este campo é obrigatório');
                isValid = false;
            }
        });
        
        // Validar email
        if (data.email && !isValidEmail(data.email)) {
            const emailInput = document.getElementById('email');
            showFieldError(emailInput, 'Por favor, insira um email válido');
            isValid = false;
        }
        
        // Validar telefone
        if (data.phone && !isValidPhone(data.phone)) {
            const phoneInput = document.getElementById('phone');
            showFieldError(phoneInput, 'Por favor, insira um telefone válido');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Funções auxiliares de validação
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Mostrar erro no campo
    function showFieldError(input, message) {
        input.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    // Remover mensagens de erro
    function removeErrorMessages() {
        const errorMessages = document.querySelectorAll('.field-error');
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        errorMessages.forEach(error => error.remove());
        inputs.forEach(input => {
            input.style.borderColor = '#e5e7eb';
        });
    }
    
    // Simular envio do formulário
    function submitForm(data) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Mostrar loading
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            // Mostrar mensagem de sucesso
            showSuccessMessage();
            
            // Reset do formulário
            contactForm.reset();
            
            // Restaurar botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            console.log('Dados do formulário:', data);
        }, 2000);
    }
    
    // Mostrar mensagem de sucesso
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
            animation: fadeInUp 0.5s ease;
        `;
        successDiv.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // ==========================================
    // UTILITÁRIOS
    // ==========================================
    
    // Verificar se elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // ==========================================
    // ANIMAÇÕES DE ENTRADA
    // ==========================================
    
    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .about-text, .contact-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // ==========================================
    // MELHORIAS DE ACESSIBILIDADE
    // ==========================================
    
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para fechar menu mobile
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Focus trap para menu mobile
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Aplicar focus trap quando menu mobile estiver ativo
    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            trapFocus(navMenu);
        }
    });
    
    // ==========================================
    // PERFORMANCE E OTIMIZAÇÕES
    // ==========================================
    
    // Debounce para scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Aplicar debounce ao scroll
    const debouncedScrollHandler = debounce(function() {
        // Código de scroll já implementado acima
    }, 10);
    
    // Lazy loading para imagens (se necessário)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================
    
    // Inicializar carrossel
    showSlide(0);
    
    // Log de inicialização
    console.log('DrSmile Landing Page carregada com sucesso!');
    
    // ==========================================
    // RESPONSIVIDADE ADICIONAL
    // ==========================================
    
    // Redimensionamento da janela
    window.addEventListener('resize', debounce(function() {
        // Fechar menu mobile se a tela ficar grande
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
        
        // Recalcular posição do carrossel
        showSlide(currentSlide);
    }, 250));
    
    // Touch/swipe support para o carrossel em dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - próximo slide
                nextBtn.click();
            } else {
                // Swipe right - slide anterior
                prevBtn.click();
            }
        }
    }
});

// ==========================================
// FUNÇÕES GLOBAIS AUXILIARES
// ==========================================

// Função para smooth scroll (pode ser chamada de qualquer lugar)
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Função para abrir WhatsApp (pode ser integrada aos botões)
function openWhatsApp(message = 'Olá! Gostaria de agendar uma consulta.') {
    const phone = '5511987654321'; // Substitua pelo número real
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}