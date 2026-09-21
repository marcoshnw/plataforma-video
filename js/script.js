// Dados das videoaulas
const videoaulas = [
    {
        categoria: "portugues",
        titulo: "Português — Aula 01",
        descricao: "Introdução à matéria",
        imagem: "img/portugues-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "portugues",
        titulo: "Português — Aula 02",
        descricao: "Classes de palavras",
        imagem: "img/portugues-02.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "portugues",
        titulo: "Português — Aula 03",
        descricao: "Sintaxe básica",
        imagem: "img/portugues-03.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "matematica",
        titulo: "Matemática — Aula 01",
        descricao: "Operações fundamentais",
        imagem: "img/matematica-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "matematica",
        titulo: "Matemática — Aula 02",
        descricao: "Frações e porcentagens",
        imagem: "img/matematica-02.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "informatica",
        titulo: "Informática — Aula 01",
        descricao: "Introdução ao Windows",
        imagem: "img/informatica-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "informatica",
        titulo: "Informática — Aula 02",
        descricao: "Excel básico",
        imagem: "img/informatica-02.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "direito-constitucional",
        titulo: "Direito Constitucional — Aula 01",
        descricao: "Conceitos fundamentais",
        imagem: "img/direito-constitucional-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "direito-constitucional",
        titulo: "Direito Constitucional — Aula 02",
        descricao: "Direitos fundamentais",
        imagem: "img/direito-constitucional-02.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "direito-administrativo",
        titulo: "Direito Administrativo — Aula 01",
        descricao: "Atos administrativos",
        imagem: "img/direito-administrativo-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "legislacao",
        titulo: "Legislação — Aula 01",
        descricao: "Lei 8.112/90",
        imagem: "img/legislacao-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "conhecimentos-gerais",
        titulo: "Conhecimentos Gerais — Aula 01",
        descricao: "Geografia do Brasil",
        imagem: "img/conhecimentos-gerais-01.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        categoria: "conhecimentos-gerais",
        titulo: "Conhecimentos Gerais — Aula 02",
        descricao: "História do Brasil",
        imagem: "img/conhecimentos-gerais-02.jpg",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

// Estado da aplicação
let categoriaAtual = 'todas';
let termoPesquisa = '';

// Função para criar card HTML
function criarCard(videoaula) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.category = videoaula.categoria;
    
    card.innerHTML = `
        <div class="thumbnail">
            <div class="play-icon">▶</div>
        </div>
        <div class="card-content">
            <h3>${videoaula.titulo}</h3>
            <p>${videoaula.descricao}</p>
        </div>
    `;
    
    card.addEventListener('click', () => abrirModal(videoaula));
    
    return card;
}

// Função para renderizar cards
function renderizarCards(filtro = 'todas', pesquisa = '') {
    const container = document.getElementById('videoCardsContainer');
    container.innerHTML = '';
    
    let cardsFiltrados = videoaulas;
    
    if (filtro !== 'todas') {
        cardsFiltrados = cardsFiltrados.filter(video => video.categoria === filtro);
    }
    
    if (pesquisa.trim() !== '') {
        const termo = pesquisa.toLowerCase();
        cardsFiltrados = cardsFiltrados.filter(video => 
            video.titulo.toLowerCase().includes(termo) ||
            video.descricao.toLowerCase().includes(termo) ||
            video.categoria.toLowerCase().includes(termo)
        );
    }
    
    cardsFiltrados.forEach(videoaula => {
        const card = criarCard(videoaula);
        container.appendChild(card);
    });
    
    if (cardsFiltrados.length === 0) {
        container.innerHTML = '<p class="no-results">Nenhuma videoaula encontrada.</p>';
    }
}
// função para atualizar o vídeo do modal
// Função para abrir modal
function abrirModal(videoaula) {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    videoPlayer.src = videoaula.video;
    modalTitle.textContent = videoaula.titulo;
    modalDescription.textContent = videoaula.descricao;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal
function fecharModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    
    videoPlayer.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Verificar autenticação ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('loggedIn');
    
    if (isAuthenticated !== 'true') {
        window.location.href = 'index.html';
    }
    
    renderizarCards(categoriaAtual, termoPesquisa);
    
    // Menu toggle para mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });
    
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });
    
    // Eventos de categorias
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            categoriaAtual = button.dataset.category;
            renderizarCards(categoriaAtual, termoPesquisa);

            // Fechar sidebar no mobile após selecionar categoria
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }
        });
    });

    // Evento do botão Flashcards
    const flashcardsBtn = document.getElementById('flashcardsBtn');
    if (flashcardsBtn) {
        flashcardsBtn.addEventListener('click', () => {
            window.location.href = 'flashcards.html';
        });
    }
    
    // Evento de pesquisa
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        termoPesquisa = e.target.value;
        renderizarCards(categoriaAtual, termoPesquisa);
    });
    
    // Evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    }
    
    // Evento de fechar modal
    document.getElementById('closeModal').addEventListener('click', fecharModal);
    
    // Fechar ao clicar fora
    document.getElementById('videoModal').addEventListener('click', (e) => {
        if (e.target.id === 'videoModal') {
            fecharModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModal();
            // Fechar sidebar se estiver aberta
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }
        }
    });
});
