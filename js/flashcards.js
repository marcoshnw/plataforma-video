// Estado da aplicação de Flashcards
let sessionState = {
    cards: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    errors: [],
    materia: '',
    assunto: '',
    quantidade: 0,
    isReviewMode: false,
    hasActiveSession: false
};

// Elementos DOM
const initialState = document.getElementById('initialState');
const sessionStateEl = document.getElementById('sessionState');
const resultState = document.getElementById('resultState');
const materiaSelect = document.getElementById('materiaSelect');
const assuntoSelect = document.getElementById('assuntoSelect');
const assuntoGroup = document.getElementById('assuntoGroup');
const quantidadeSelect = document.getElementById('quantidadeSelect');
const cardsDisponiveis = document.getElementById('cardsDisponiveis');
const selectionForm = document.getElementById('selectionForm');
const startBtn = document.getElementById('startBtn');
const sessionInfo = document.getElementById('sessionInfo');
const infoMateria = document.getElementById('infoMateria');
const infoAssunto = document.getElementById('infoAssunto');
const infoQuantidade = document.getElementById('infoQuantidade');
const cardCounter = document.getElementById('cardCounter');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const answerSection = document.getElementById('answerSection');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const answerButtons = document.getElementById('answerButtons');
const correctBtn = document.getElementById('correctBtn');
const wrongBtn = document.getElementById('wrongBtn');
const totalCards = document.getElementById('totalCards');
const correctCount = document.getElementById('correctCount');
const wrongCount = document.getElementById('wrongCount');
const percentageValue = document.getElementById('percentageValue');
const visualCorrect = document.getElementById('visualCorrect');
const visualWrong = document.getElementById('visualWrong');
const reviewErrorsBtn = document.getElementById('reviewErrorsBtn');
const retryBtn = document.getElementById('retryBtn');
const backBtn = document.getElementById('backBtn');
const adminBtn = document.getElementById('adminBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    popularMaterias();
    configurarEventos();
});

// Verificar autenticação
function verificarAutenticacao() {
    const isAuthenticated = sessionStorage.getItem('loggedIn');
    if (isAuthenticated !== 'true') {
        window.location.href = 'index.html';
    }
}

// Popular dropdown de matérias
function popularMaterias() {
    materiaSelect.innerHTML = '<option value="">Selecione uma matéria</option>';
    
    Object.entries(materias).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        materiaSelect.appendChild(option);
    });
}

// Configurar eventos
function configurarEventos() {
    // Mudança de matéria - com confirmação se houver sessão ativa
    materiaSelect.addEventListener('change', () => {
        const materia = materiaSelect.value;
        if (materia) {
            popularAssuntos(materia);
            assuntoGroup.style.display = 'block';
            atualizarCardsDisponiveis();
        } else {
            assuntoGroup.style.display = 'none';
            cardsDisponiveis.textContent = '';
        }

        // Confirmar se houver sessão ativa
        if (sessionState.hasActiveSession && materia !== sessionState.materia) {
            confirmarNovaSessao();
        }
    });

    // Mudança de assunto - com confirmação se houver sessão ativa
    assuntoSelect.addEventListener('change', () => {
        atualizarCardsDisponiveis();
        
        // Confirmar se houver sessão ativa
        if (sessionState.hasActiveSession && assuntoSelect.value !== sessionState.assunto) {
            confirmarNovaSessao();
        }
    });

    // Mudança de quantidade
    quantidadeSelect.addEventListener('change', atualizarCardsDisponiveis);

    // Submissão do formulário
    selectionForm.addEventListener('submit', iniciarSessao);

    // Mostrar resposta
    showAnswerBtn.addEventListener('click', mostrarResposta);

    // Botões de resposta
    correctBtn.addEventListener('click', () => registrarResposta(true));
    wrongBtn.addEventListener('click', () => registrarResposta(false));

    // Botões de resultado
    reviewErrorsBtn.addEventListener('click', revisarErros);
    retryBtn.addEventListener('click', tentarNovamente);

    // Botão voltar
    backBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Botão admin
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'flashcards-admin.html';
        });
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.location.href = 'index.html';
    });
}

// Confirmar nova sessão
function confirmarNovaSessao() {
    if (sessionState.hasActiveSession) {
        const confirmar = confirm('Você possui uma sessão em andamento. Deseja iniciar uma nova sessão com esta seleção?');
        if (confirmar) {
            // A sessão será iniciada quando o usuário clicar em Começar
            sessionState.hasActiveSession = false;
            mostrarEstado('initial');
        } else {
            // Reverter seleção
            materiaSelect.value = sessionState.materia;
            popularAssuntos(sessionState.materia);
            assuntoSelect.value = sessionState.assunto;
            assuntoGroup.style.display = 'block';
        }
    }
}

// Popular assuntos de uma matéria
function popularAssuntos(materia) {
    assuntoSelect.innerHTML = '<option value="">Todos os assuntos</option>';
    
    const assuntos = getAssuntosPorMateria(materia);
    assuntos.forEach(assunto => {
        const option = document.createElement('option');
        option.value = assunto;
        option.textContent = assunto;
        assuntoSelect.appendChild(option);
    });
}

// Atualizar informação de cards disponíveis
function atualizarCardsDisponiveis() {
    const materia = materiaSelect.value;
    const assunto = assuntoSelect.value;
    
    if (!materia) {
        cardsDisponiveis.textContent = '';
        return;
    }

    let cards;
    if (assunto) {
        cards = getFlashcardsPorMateriaAssunto(materia, assunto);
    } else {
        cards = getFlashcardsPorMateria(materia);
    }

    const quantidade = cards.length;
    cardsDisponiveis.textContent = `${quantidade} card(s) disponível(is)`;
}

// Iniciar sessão de estudo
function iniciarSessao(e) {
    e.preventDefault();
    
    const materia = materiaSelect.value;
    const assunto = assuntoSelect.value;
    const quantidade = quantidadeSelect.value;

    let cards;
    if (assunto) {
        cards = getFlashcardsPorMateriaAssunto(materia, assunto);
    } else {
        cards = getFlashcardsPorMateria(materia);
    }

    if (cards.length === 0) {
        alert('Não há flashcards disponíveis para esta seleção.');
        return;
    }

    // Limitar quantidade
    let quantidadeFinal;
    if (quantidade === 'all') {
        quantidadeFinal = cards.length;
    } else {
        quantidadeFinal = Math.min(parseInt(quantidade), cards.length);
    }

    // Embaralhar e selecionar cards
    const cardsEmbaralhados = embaralharArray(cards);
    sessionState.cards = cardsEmbaralhados.slice(0, quantidadeFinal);
    sessionState.currentIndex = 0;
    sessionState.correctCount = 0;
    sessionState.wrongCount = 0;
    sessionState.errors = [];
    sessionState.materia = materia;
    sessionState.assunto = assunto;
    sessionState.quantidade = quantidadeFinal;
    sessionState.isReviewMode = false;
    sessionState.hasActiveSession = true;

    // Atualizar informações da sessão no painel esquerdo
    atualizarInfoSessao();
    
    // Mudar botão para "Reiniciar"
    startBtn.textContent = 'Reiniciar';

    mostrarEstado('session');
    mostrarCardAtual();
}

// Atualizar informações da sessão no painel esquerdo
function atualizarInfoSessao() {
    infoMateria.textContent = materias[sessionState.materia] || sessionState.materia;
    infoAssunto.textContent = sessionState.assunto || 'Todos';
    infoQuantidade.textContent = sessionState.quantidade;
    sessionInfo.style.display = 'block';
}

// Mostrar estado específico
function mostrarEstado(estado) {
    initialState.style.display = 'none';
    sessionStateEl.style.display = 'none';
    resultState.style.display = 'none';

    switch (estado) {
        case 'initial':
            initialState.style.display = 'block';
            break;
        case 'session':
            sessionStateEl.style.display = 'block';
            break;
        case 'result':
            resultState.style.display = 'block';
            break;
    }
}

// Mostrar card atual
function mostrarCardAtual() {
    const card = sessionState.cards[sessionState.currentIndex];
    
    questionText.textContent = card.pergunta;
    answerText.textContent = card.resposta;
    
    // Resetar estado
    answerSection.style.display = 'none';
    showAnswerBtn.style.display = 'block';
    answerButtons.style.display = 'none';
    
    // Atualizar progresso
    atualizarProgresso();
}

// Atualizar progresso
function atualizarProgresso() {
    const current = sessionState.currentIndex + 1;
    const total = sessionState.cards.length;
    const percent = Math.round((current / total) * 100);

    cardCounter.textContent = `${current} / ${total}`;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
}

// Mostrar resposta
function mostrarResposta() {
    answerSection.style.display = 'block';
    showAnswerBtn.style.display = 'none';
    answerButtons.style.display = 'flex';
}

// Registrar resposta
function registrarResposta(acertou) {
    const card = sessionState.cards[sessionState.currentIndex];
    
    if (acertou) {
        sessionState.correctCount++;
    } else {
        sessionState.wrongCount++;
        sessionState.errors.push(card);
    }

    sessionState.currentIndex++;

    if (sessionState.currentIndex >= sessionState.cards.length) {
        mostrarResultado();
    } else {
        mostrarCardAtual();
    }
}

// Mostrar resultado
function mostrarResultado() {
    const total = sessionState.cards.length;
    const correct = sessionState.correctCount;
    const wrong = sessionState.wrongCount;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    totalCards.textContent = total;
    correctCount.textContent = correct;
    wrongCount.textContent = wrong;
    percentageValue.textContent = `${percent}%`;
    visualCorrect.textContent = `${correct} acertos`;
    visualWrong.textContent = `${wrong} erros`;

    // Mostrar/esconder botão de revisar erros
    reviewErrorsBtn.style.display = wrong > 0 ? 'block' : 'none';

    sessionState.hasActiveSession = false;
    mostrarEstado('result');
}

// Revisar erros
function revisarErros() {
    if (sessionState.errors.length === 0) {
        alert('Não há erros para revisar.');
        return;
    }

    // Embaralhar erros
    sessionState.cards = embaralharArray(sessionState.errors);
    sessionState.currentIndex = 0;
    sessionState.correctCount = 0;
    sessionState.wrongCount = 0;
    sessionState.errors = [];
    sessionState.isReviewMode = true;
    sessionState.hasActiveSession = true;

    mostrarEstado('session');
    mostrarCardAtual();
}

// Tentar novamente
function tentarNovamente() {
    let cards;
    if (sessionState.assunto) {
        cards = getFlashcardsPorMateriaAssunto(sessionState.materia, sessionState.assunto);
    } else {
        cards = getFlashcardsPorMateria(sessionState.materia);
    }

    if (cards.length === 0) {
        alert('Não há flashcards disponíveis.');
        return;
    }

    // Embaralhar e selecionar cards
    const cardsEmbaralhados = embaralharArray(cards);
    sessionState.cards = cardsEmbaralhados.slice(0, sessionState.quantidade);
    sessionState.currentIndex = 0;
    sessionState.correctCount = 0;
    sessionState.wrongCount = 0;
    sessionState.errors = [];
    sessionState.isReviewMode = false;
    sessionState.hasActiveSession = true;

    mostrarEstado('session');
    mostrarCardAtual();
}
