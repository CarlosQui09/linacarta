// Variables globales
let currentPage = 1;
const totalPages = 3;

// Elementos del DOM
const envelope = document.getElementById('envelope');
const pages = document.querySelectorAll('.page');

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Barra de progreso con corazones
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const fill = loadingScreen.querySelector('.love-fill');
        let progress = 0;
        const int = setInterval(() => {
            progress += Math.random() * 25;
            if (fill) fill.style.width = Math.min(progress, 100) + '%';
            if (progress >= 100) {
                clearInterval(int);
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.style.display = 'none', 500);
                // Nota: dejamos el play de música al click para evitar bloqueos de autoplay
            }
        }, 300);
    }
    
    initializePage();
    addEventListeners();
});

// Función de inicialización
function initializePage() {
    // Asegurar que solo la primera página esté visible
    pages.forEach((page, index) => {
        if (index === 0) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    
    // Agregar efectos de entrada para la primera página
    addEntranceEffects();
}

// Agregar event listeners
function addEventListeners() {
    // Event listener para el sobre
    if (envelope) {
        envelope.addEventListener('click', function onEnvelopeClick(e){
            if (e.target.closest('#envelope')) {
                // intentar iniciar audio con interacción del usuario
                const music = document.getElementById('bg-music');
                if (music && music.paused) { try { music.play(); } catch(_) {} }
                openEnvelope();
            }
        });
    }
    
    // Event listener para teclas de navegación
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Event listener para swipe en dispositivos móviles
    addSwipeSupport();
}

// Función para abrir el sobre
function openEnvelope() {
    if (envelope.classList.contains('opened')) {
        return; // Ya está abierto
    }
    // Usar efecto LoveCard: clase 'abierto' y ocultar DE/PARA
    const fromTo = envelope.querySelector('.from-to-inline');
    if (fromTo) fromTo.style.opacity = '0';
    envelope.classList.add('abierto');
    envelope.classList.remove('wiggle');
    
    // Reproducir sonido de papel (opcional)
    playPaperSound();
    
    // Después de la animación, cambiar a la siguiente página
    // Esperar a que la solapa y sello animen, luego pasar a la página 2
    setTimeout(() => {
        nextPage();
    }, 1200);
}

// Función para pasar a la siguiente página
function nextPage() {
    if (currentPage < totalPages) {
        // Ocultar página actual
        const currentPageElement = document.getElementById(`page${currentPage}`);
        currentPageElement.classList.remove('active');
        
        // Mostrar siguiente página
        currentPage++;
        const nextPageElement = document.getElementById(`page${currentPage}`);
        nextPageElement.classList.add('active');
        
        // Agregar efectos de entrada para la nueva página
        addEntranceEffects();
        
        // Actualizar indicador de página
        updatePageIndicator();
        
        // Efectos especiales según la página
        if (currentPage === 2) {
            animatePage2();
            startTypewriter();
        } else if (currentPage === 3) {
            animatePage3();
            startTypewriter3();
        }
    }
}

// Función para volver a la página anterior
function previousPage() {
    if (currentPage > 1) {
        // Ocultar página actual
        const currentPageElement = document.getElementById(`page${currentPage}`);
        currentPageElement.classList.remove('active');
        
        // Mostrar página anterior
        currentPage--;
        const previousPageElement = document.getElementById(`page${currentPage}`);
        previousPageElement.classList.add('active');
        
        // Actualizar indicador de página
        updatePageIndicator();
    }
}

// Función para actualizar el indicador de página
function updatePageIndicator() {
    const indicators = document.querySelectorAll('.page-indicator');
    indicators.forEach(indicator => {
        indicator.textContent = `${currentPage} de ${totalPages}`;
    });
}

// Función para agregar efectos de entrada
function addEntranceEffects() {
    const activePage = document.querySelector('.page.active');
    
    if (activePage) {
        // Agregar clase para animaciones de entrada
        activePage.style.animation = 'fadeIn 0.5s ease-out';
        
        // Remover la animación después de que termine
        setTimeout(() => {
            activePage.style.animation = '';
        }, 500);
    }
}

// Función para animar la página 2
function animatePage2() {
    // Mostrar imagen y botón después del texto
    const photo = document.querySelector('#page2 .hero-photo');
    const balloons = document.querySelectorAll('#page2 .balloons');
    const sparkles = document.querySelectorAll('#page2 .sparkles');
    const btn = document.querySelector('#page2 .next-btn');
    if (photo) {
        photo.style.opacity = '0';
        photo.style.transform = 'translateY(20px) scale(0.98)';
    }
    balloons.forEach(b => { b.style.opacity = '0'; b.style.transform = 'translateY(-10px)'; });
    sparkles.forEach(s => { s.style.opacity = '0'; s.style.transform = 'translateY(10px)'; });
    if (btn) {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(30px)';
    }
    // Estimar duración del typewriter y luego revelar
    const totalChars = (
        'En este día tan especial quiero que sepas lo mucho que significas para mí. Cada momento contigo es un regalo que atesoro con todo mi corazón. Deseo que este nuevo año de vida esté lleno de alegría, amor y momentos inolvidables. ✨'+
        'Quiero que siempre tengas presente lo valiosa que eres, porque eres única en este mundo. Desde el día en que te conocí supe que eras especial: llena de energía, amor y, sobre todo, de mucha alegría. Te deseo, desde lo más profundo de mi corazón, lo mejor para tu vida; que cumplas todos tus sueños, que viajes mucho y que conozcas muchísimos lugares. 🌟'+
        'Solo me queda decirte que siempre estaré ahí para ti en lo que pueda ayudarte, que nunca dejaré de pensarte ni de amarte. Deseo que la vida te colme de felicidad, porque eres y siempre serás el amor de mi vida, a pesar de todo. Dios te bendiga y que disfrutes mucho este cumpleaños. 🎂'+
        'TE AMO ❤️'
    ).length;
    const estimatedMs = totalChars * 55 + 3 * 550 + 400; // tiempo de tipeo + saltos de línea + margen
    setTimeout(() => {
        if (photo) {
            photo.style.transition = 'all .8s ease-out';
            photo.style.opacity = '1';
            photo.style.transform = 'translateY(0) scale(1)';
        }
        // luego adornos
        setTimeout(() => {
            balloons.forEach(b => { b.style.opacity = '1'; b.style.transform = 'translateY(0)'; b.style.transition = 'all .7s ease-out'; });
            sparkles.forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; s.style.transition = 'all .7s ease-out'; });
        }, 250);
        // por último el botón
        if (btn) {
            setTimeout(() => {
                btn.style.transition = 'all .8s ease-out';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
                btn.style.visibility = 'visible';
            }, 600);
        }
    }, estimatedMs);
    
    // Animar elementos decorativos
    animateDecorations();
}

// Escribir texto con efecto máquina de escribir
function startTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const lines = [
        'En este día tan especial quiero que sepas lo mucho que significas para mí. Cada momento contigo es un regalo que atesoro con todo mi corazón. Deseo que este nuevo año de vida esté lleno de alegría, amor y momentos inolvidables. ✨',
        'Quiero que siempre tengas presente lo valiosa que eres, porque eres única en este mundo. Desde el día en que te conocí supe que eras especial: llena de energía, amor y, sobre todo, de mucha alegría. Te deseo, desde lo más profundo de mi corazón, lo mejor para tu vida; que cumplas todos tus sueños, que viajes mucho y que conozcas muchísimos lugares. 🌟',
        'Solo me queda decirte que siempre estaré ahí para ti en lo que pueda ayudarte, que nunca dejaré de pensarte ni de amarte. Deseo que la vida te colme de felicidad, porque eres y siempre serás el amor de mi vida, a pesar de todo. Dios te bendiga y que disfrutes mucho este cumpleaños. 🎂',
        'TE AMO ❤️'
    ];
    el.innerHTML = '';
    el.classList.remove('hide-caret');
    let lineIndex = 0;
    let charIndex = 0;
    let caret = document.createElement('span');
    caret.className = 'caret';
    el.appendChild(caret);
    function type() {
        if (lineIndex >= lines.length) {
            el.classList.add('hide-caret');
            return;
        }
        if (charIndex < lines[lineIndex].length) {
            caret.insertAdjacentText('beforebegin', lines[lineIndex].charAt(charIndex));
            charIndex++;
            setTimeout(type, 55); // más lento
        } else {
            caret.insertAdjacentHTML('beforebegin', '<br/>');
            lineIndex++;
            charIndex = 0;
            setTimeout(type, 550);
        }
    }
    type();
}

// Función para animar la página 3
function animatePage3() {
    // Preparar elementos para aparición secuencial
    const actions = document.querySelector('#page3 .final-actions');
    const animationLayer = document.querySelector('#page3 .celebration-animation');
    const photo = document.querySelector('#page3 .hero-photo');
    const balloons = document.querySelectorAll('#page3 .balloons');
    const sparkles = document.querySelectorAll('#page3 .sparkles');
    if (actions) { actions.style.opacity = '0'; actions.style.transform = 'translateY(20px)'; }
    if (animationLayer) { animationLayer.style.opacity = '0'; }
    if (photo) { photo.style.opacity = '0'; photo.style.transform = 'translateY(20px) scale(0.98)'; }
    balloons.forEach(b => { b.style.opacity = '0'; b.style.transform = 'translateY(-10px)'; });
    sparkles.forEach(s => { s.style.opacity = '0'; s.style.transform = 'translateY(10px)'; });
    // Iniciar animaciones de celebración luego del typewriter3 (se activa en startTypewriter3)
}

// Función para animar decoraciones
function animateDecorations() {
    // Animar pastel
    const cake = document.querySelector('.birthday-cake');
    if (cake) {
        cake.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Animar globos
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
        balloon.style.animation = `swing 2s ease-in-out infinite ${index * 0.5}s`;
    });
    
    // Animar brillos
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        sparkle.style.animation = `twinkle 1.5s ease-in-out infinite ${index * 0.3}s`;
    });
}

// Función para iniciar animaciones de celebración
function startCelebrationAnimations() {
    // Animar corazones flotantes
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.style.animation = `floatHeart 6s ease-in-out infinite ${index}s`;
    });
    
    // Animar confeti
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach((piece, index) => {
        piece.style.animation = `confettiFall 3s linear infinite ${index * 0.5}s`;
    });
}
// Typewriter para página 3 y revelado secuencial
function startTypewriter3() {
    const el = document.getElementById('typewriter3');
    if (!el) return;
    el.innerHTML = '';
    el.classList.remove('hide-caret');
    const lines = [
        'Eres una persona increíble, fuerte e inteligente, con muchísimas capacidades para lograr todo lo que te propongas. Nunca te dejes bloquear por comentarios; confía en ti y en tus habilidades, porque la vida tiene preparadas grandes bendiciones. Que cada día sea una nueva aventura llena de risas, amor y momentos especiales. Tú mereces toda la felicidad del mundo, y también lo mejor para tu familia.',
        'Siempre estaré, aunque sea desde la distancia, deseándote lo mejor. Gracias de corazón por los años compartidos; siempre los recordaré con mucho amor. Perdón por lo malo que te hice vivir, porque no lo mereces. Ojalá llegue alguien que te valore de verdad, que te llene de amor y te dé todo lo que mereces.',
        'La canción de fondo quiero que la escuches al menos una vez más, y recuerdes que siempre voy a amarte a ti y a Loky. Los extrañaré; siempre serán los seres que más he amado. Solo deseo que todo sea bonito para ustedes, que luchen por sus sueños y que la vida los llene de felicidad. Siempre te amaré, te extrañaré y los llevaré en mi corazón para toda la vida. ❤️'
    ];
    let lineIndex = 0;
    let charIndex = 0;
    const caret = document.createElement('span');
    caret.className = 'caret';
    el.appendChild(caret);
    function type() {
        if (lineIndex >= lines.length) {
            el.classList.add('hide-caret');
            // Mostrar imagen, adornos y corazones, luego confeti y al final botones
            const photo = document.querySelector('#page3 .hero-photo');
            const balloons = document.querySelectorAll('#page3 .balloons');
            const sparkles = document.querySelectorAll('#page3 .sparkles');
            const heartsLayer = document.querySelector('#page3 .floating-hearts');
            const animationLayer = document.querySelector('#page3 .celebration-animation');
            if (photo) { photo.style.transition = 'all .8s ease-out'; photo.style.opacity = '1'; photo.style.transform = 'translateY(0) scale(1)'; }
            setTimeout(() => {
                balloons.forEach(b => { b.style.transition = 'all .7s ease-out'; b.style.opacity = '1'; b.style.transform = 'translateY(0)'; });
                sparkles.forEach(s => { s.style.transition = 'all .7s ease-out'; s.style.opacity = '1'; s.style.transform = 'translateY(0)'; });
            }, 250);
            setTimeout(() => {
                if (heartsLayer) {
                    heartsLayer.style.transition = 'opacity .6s ease-out';
                    heartsLayer.style.opacity = '1';
                }
            }, 500);
            setTimeout(() => {
                if (animationLayer) {
                    animationLayer.style.transition = 'opacity .6s ease-out';
                    animationLayer.style.opacity = '1';
                    startCelebrationAnimations();
                }
            }, 700);
            // Mostrar botones al final
            const actions = document.querySelector('#page3 .final-actions');
            if (actions) {
                setTimeout(() => {
                    actions.style.transition = 'all .8s ease-out';
                    actions.style.opacity = '1';
                    actions.style.transform = 'translateY(0)';
                    actions.querySelectorAll('.next-btn').forEach(b=> {
                        b.style.visibility='visible';
                        b.style.opacity='1';
                        b.style.transform='translateY(0)';
                    });
                }, 1100);
            }
            // Wire buttons
            wireFinalButtons();
            return;
        }
        if (charIndex < lines[lineIndex].length) {
            caret.insertAdjacentText('beforebegin', lines[lineIndex].charAt(charIndex));
            charIndex++;
            setTimeout(type, 55);
        } else {
            caret.insertAdjacentHTML('beforebegin', '<br/>');
            lineIndex++;
            charIndex = 0;
            setTimeout(type, 550);
        }
    }
    type();
}

function wireFinalButtons() {
    const back = document.getElementById('btn-back');
    const home = document.getElementById('btn-home');
    if (back) back.onclick = () => goToPage(2);
    if (home) home.onclick = () => { window.location.reload(); };
}

// Función para manejar navegación con teclado
function handleKeyNavigation(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ':
            event.preventDefault();
            if (currentPage < totalPages) {
                nextPage();
            }
            break;
        case 'ArrowLeft':
            event.preventDefault();
            if (currentPage > 1) {
                previousPage();
            }
            break;
        case 'Escape':
            // Volver a la primera página
            goToPage(1);
            break;
    }
}

// Función para ir a una página específica
function goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        // Ocultar página actual
        const currentPageElement = document.querySelector('.page.active');
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }
        
        // Mostrar página objetivo
        const targetPageElement = document.getElementById(`page${pageNumber}`);
        targetPageElement.classList.add('active');
        
        // Actualizar página actual
        currentPage = pageNumber;
        
        // Actualizar indicador de página
        updatePageIndicator();
        
        // Agregar efectos según la página
        if (pageNumber === 2) {
            animatePage2();
        } else if (pageNumber === 3) {
            animatePage3();
        }
    }
}

// Función para agregar soporte de swipe en dispositivos móviles
function addSwipeSupport() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(event) {
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
        
        handleSwipe();
    });
    
    function handleSwipe() {
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Verificar si es un swipe horizontal válido
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe izquierda - siguiente página
                if (currentPage < totalPages) {
                    nextPage();
                }
            } else {
                // Swipe derecha - página anterior
                if (currentPage > 1) {
                    previousPage();
                }
            }
        }
    }
}

// Función para reproducir sonido de papel (opcional)
function playPaperSound() {
    // Crear un contexto de audio simple
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Si no se puede reproducir audio, continuar sin él
        console.log('Audio no disponible');
    }
}

// Función para agregar efectos de partículas adicionales
function addParticleEffects() {
    if (currentPage === 3) {
        // Crear partículas adicionales
        for (let i = 0; i < 10; i++) {
            createParticle();
        }
    }
}

// Función para crear partículas
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: linear-gradient(45deg, #ff6b6b, #ffd700);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat 4s ease-in-out infinite;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
    `;
    
    document.querySelector('#page3').appendChild(particle);
    
    // Remover partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 4000);
}

// Agregar estilos CSS para partículas adicionales
const additionalStyles = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

// Insertar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Función para reiniciar la experiencia
function resetExperience() {
    // Volver a la primera página
    goToPage(1);
    
    // Resetear el sobre
    if (envelope) {
        envelope.classList.remove('opened');
    }
    
    // Limpiar partículas
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
}

// Eliminado reset button; usamos botones finales en página 3



// Función para crear efecto de flores al hacer clic
function createFlowerEffect(x, y) {
    const flowers = ['🌸', '🌺', '🌷', '💐'];
    const count = 3; // solo 3 flores
    for (let i = 0; i < count; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        const angle = (Math.PI * 2) * (i / count) + Math.random() * 0.4;
        const distance = 8 + Math.random() * 40;
        const size = 16 + Math.floor(Math.random() * 6);
        const duration = 1000 + Math.random() * 600;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        flower.style.left = x + offsetX + 'px';
        flower.style.top = y + offsetY + 'px';
        flower.style.fontSize = size + 'px';
        flower.style.opacity = '0';
        flower.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        document.body.appendChild(flower);
        requestAnimationFrame(() => {
            flower.style.opacity = '1';
            flower.style.transform = `translate(-50%, -50%) scale(1.1)`;
        });
        setTimeout(() => {
            flower.style.opacity = '0';
        }, duration - 200);
        setTimeout(() => flower.remove(), duration + 50);
    }
}

// Agregar event listener para clics en toda la página (evitar sobre/carta)
document.addEventListener('click', function(event) {
    if (event.target.closest('#envelope')) {
        return;
    }
    createFlowerEffect(event.clientX, event.clientY);
});

// Agregar soporte para eventos táctiles en móviles (evitar sobre/carta)
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.closest && target.closest('#envelope')) {
            return;
        }
        createFlowerEffect(touch.clientX, touch.clientY);
    }
});
