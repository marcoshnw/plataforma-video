// Credenciais de exemplo (para testes)
const CREDENTIALS = {
    username: 'admin',
    password: '123'
};

// Verificar se já está autenticado
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('loggedIn');
    
    if (isAuthenticated === 'true') {
        window.location.href = 'dashboard.html';
    }
});

// Formulário de login
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const transitionOverlay = document.getElementById('transitionOverlay');
const transitionM = document.getElementById('transitionM');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validar credenciais
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        // Salvar autenticação no sessionStorage
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        
        // Iniciar animação de transição
        iniciarTransicao();
    } else {
        // Mostrar erro
        errorMessage.textContent = 'Usuário ou senha incorretos';
        errorMessage.style.display = 'block';
        
        // Limpar campos
        document.getElementById('password').value = '';
    }
});

// Função para iniciar a transição
function iniciarTransicao() {
    // Mostrar overlay
    transitionOverlay.classList.add('active');
    
    // Iniciar animação do M após pequeno delay
    setTimeout(() => {
        transitionM.classList.add('animate');
        
        // Redirecionar após a animação completar (2.2s)
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2200);
    }, 400);
}
