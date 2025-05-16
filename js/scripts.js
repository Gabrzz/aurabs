/* MEUS CODIGOS JS */



window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.55; // Ajuste a velocidade aqui (0 = estático, 1 = mesma velocidade do scroll)

    document.querySelectorAll('.parallax-background').forEach(element => {
        element.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
});



const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const waveContainer = document.getElementById('waveContainer');

function resizeCanvas() {
    canvas.width = waveContainer.offsetWidth;
    canvas.height = waveContainer.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configurações da onda
const waveColor = '#262525';
const waveAmplitude = 0.1; // Amplitude reduzida para movimento mais suave
const waveSpeed = 0.02; // Velocidade reduzida

// Variáveis para movimento
let phase = 0;

// Menos pontos de controle para curvas mais suaves
const controlPoints = [
    { x: 0, y: 0.4 },
    { x: 0.25, y: 0.2 },
    { x: 0.5, y: 0.5 },
    { x: 0.75, y: 0.7 },
    { x: 1.0, y: 0.4 }
];

function drawWave() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Começa o caminho da onda
    ctx.beginPath();

    // Garante que o caminho comece no canto inferior esquerdo
    ctx.moveTo(0, canvas.height);

    // Pontos de controle para a curva Bezier
    const points = [];

    // Calcula os pontos com movimento de onda
    for (let i = 0; i < controlPoints.length; i++) {
        const point = controlPoints[i];
        const x = point.x * canvas.width;

        // Adiciona movimento de onda - mais suave nas bordas
        let waveEffect = Math.sin(point.x * Math.PI * 2 + phase) * waveAmplitude;

        // Reduz o efeito de onda nas bordas para garantir que toquem a tela
        if (point.x === 0 || point.x === 1.0) {
            waveEffect *= 0.5;
        }

        const y = (point.y + waveEffect) * canvas.height;
        points.push({ x, y });
    }

    // Garante que o primeiro ponto toque a borda esquerda
    ctx.lineTo(0, points[0].y);

    // Desenha a curva usando Bezier cúbico para maior suavidade
    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        // Calcula os pontos de controle para a curva Bezier
        const cp1x = current.x + (next.x - current.x) / 3;
        const cp1y = current.y;
        const cp2x = current.x + 2 * (next.x - current.x) / 3;
        const cp2y = next.y;

        // Desenha a curva Bezier cúbica
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
    }

    // Garante que o último ponto toque a borda direita
    ctx.lineTo(canvas.width, points[points.length - 1].y);

    // Completa o caminho até os cantos inferiores
    ctx.lineTo(canvas.width, canvas.height);

    // Preenche a onda
    ctx.fillStyle = waveColor;
    ctx.fill();

    // Atualiza a fase para criar movimento
    phase += waveSpeed;

    // Continua a animação
    requestAnimationFrame(drawWave);
}

// Inicia a animação
drawWave();


document.addEventListener('DOMContentLoaded', function() {
            const boxes = document.querySelectorAll('.expandable-box');
            
            // Função para verificar se é dispositivo móvel
            function isMobile() {
                return window.innerWidth <= 768 || 
                       navigator.maxTouchPoints > 0 || 
                       navigator.msMaxTouchPoints > 0;
            }
            
            // Adicionar eventos apropriados com base no dispositivo
            boxes.forEach(box => {
                if (isMobile()) {
                    // Em dispositivos móveis, usar clique
                    box.addEventListener('click', function() {
                        this.classList.toggle('expanded');
                    });
                } else {
                    // Em desktop, usar mouseenter/mouseleave
                    box.addEventListener('mouseenter', function() {
                        this.classList.add('expanded');
                    });
                    
                    box.addEventListener('mouseleave', function() {
                        this.classList.remove('expanded');
                    });
                }
            });
            
            // Atualizar comportamento se o tamanho da tela mudar
            window.addEventListener('resize', function() {
                boxes.forEach(box => {
                    box.classList.remove('expanded');
                    
                    // Remover todos os event listeners anteriores
                    const newBox = box.cloneNode(true);
                    box.parentNode.replaceChild(newBox, box);
                });
                
                // Reconfigurar os event listeners
                const newBoxes = document.querySelectorAll('.expandable-box');
                newBoxes.forEach(box => {
                    if (isMobile()) {
                        box.addEventListener('click', function() {
                            this.classList.toggle('expanded');
                        });
                    } else {
                        box.addEventListener('mouseenter', function() {
                            this.classList.add('expanded');
                        });
                        
                        box.addEventListener('mouseleave', function() {
                            this.classList.remove('expanded');
                        });
                    }
                });
            });
        });









// Função para lidar com o envio do formulário
document.getElementById('contactForm').addEventListener('submit', function(event) {
  // Previne o comportamento padrão do formulário
  event.preventDefault();
  
  // Coleta os dados do formulário
  const formData = {
    companyName: document.getElementById('companyName').value,
    contactName: document.getElementById('contactName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    interest: document.getElementById('interest').value,
    message: document.getElementById('message').value,
    // Adiciona timestamp para rastreamento
    timestamp: new Date().toISOString()
  };
  
  // Desabilita o botão de envio para prevenir múltiplos envios
  const submitButton = this.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
  
  // Log para debug (pode ser removido em produção)
  console.log('Enviando dados:', JSON.stringify(formData));
  
  // Envia os dados para o webhook em formato JSON
  fetch('https://n8n.aurabs.com.br/webhook/aura-contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    // Tenta fazer o parse da resposta como JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // Se a resposta não for JSON, retorna um objeto simples
      return { success: true };
    }
  })
  .then(data => {
    console.log('Resposta recebida:', data);
    
    // Exibe o popup de sucesso
    showSuccessPopup();
    
    // Limpa o formulário
    this.reset();
  })
  .catch(error => {
    // Em caso de erro, mostra uma mensagem de erro
    console.error('Erro ao enviar formulário:', error);
    showErrorPopup(error.message);
  })
  .finally(() => {
    // Reativa o botão de envio
    submitButton.disabled = false;
    submitButton.innerHTML = 'Solicitar Orçamento';
  });
});

// Função para mostrar o popup de sucesso
function showSuccessPopup() {
  // Cria o elemento do popup
  const popup = document.createElement('div');
  popup.className = 'success-popup';
  popup.innerHTML = `
    <div class="success-popup-content">
      <div class="success-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <h3>Mensagem Enviada!</h3>
      <p>Agradecemos seu contato. Retornaremos em breve.</p>
      <button class="btn btn-primary close-popup">Fechar</button>
    </div>
  `;
  
  // Adiciona o popup ao corpo do documento
  document.body.appendChild(popup);
  
  // Adiciona a classe para mostrar o popup com animação
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  
  // Adiciona evento para fechar o popup
  popup.querySelector('.close-popup').addEventListener('click', () => {
    popup.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  });
  
  // Fecha o popup automaticamente após 5 segundos
  setTimeout(() => {
    if (document.body.contains(popup)) {
      popup.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 300);
    }
  }, 5000);
}

// Função para mostrar o popup de erro
function showErrorPopup(errorMessage) {
  // Cria o elemento do popup
  const popup = document.createElement('div');
  popup.className = 'error-popup';
  popup.innerHTML = `
    <div class="error-popup-content">
      <div class="error-icon">
        <i class="bi bi-exclamation-circle-fill"></i>
      </div>
      <h3>Erro ao Enviar</h3>
      <p>Ocorreu um problema ao enviar sua mensagem. Por favor, tente novamente.</p>
      <p class="error-details">${errorMessage}</p>
      <button class="btn btn-danger close-popup">Fechar</button>
    </div>
  `;
  
  // Adiciona o popup ao corpo do documento
  document.body.appendChild(popup);
  
  // Adiciona a classe para mostrar o popup com animação
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  
  // Adiciona evento para fechar o popup
  popup.querySelector('.close-popup').addEventListener('click', () => {
    popup.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  });
}








        
/* CODIGOS TEMPLATE JS */


/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 


window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});