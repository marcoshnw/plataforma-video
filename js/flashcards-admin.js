// Elementos DOM
const flashcardsList = document.getElementById('flashcardsList');
const flashcardForm = document.getElementById('flashcardForm');
const filterMateria = document.getElementById('filterMateria');
const filterAssunto = document.getElementById('filterAssunto');
const flashcardsTableBody = document.getElementById('flashcardsTableBody');
const noResults = document.getElementById('noResults');
const addFlashcardBtn = document.getElementById('addFlashcardBtn');
const editForm = document.getElementById('editForm');
const formTitle = document.getElementById('formTitle');
const editId = document.getElementById('editId');
const editMateria = document.getElementById('editMateria');
const editAssunto = document.getElementById('editAssunto');
const editPergunta = document.getElementById('editPergunta');
const editResposta = document.getElementById('editResposta');
const cancelBtn = document.getElementById('cancelBtn');
const confirmModal = document.getElementById('confirmModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const backBtn = document.getElementById('backBtn');
const logoutBtn = document.getElementById('logoutBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

let deleteId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    popularMaterias();
    carregarFlashcards();
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
    // Filtros
    filterMateria.innerHTML = '<option value="">Todas</option>';
    // Formulário
    editMateria.innerHTML = '<option value="">Selecione uma matéria</option>';
    
    Object.entries(materias).forEach(([key, value]) => {
        // Filtros
        const filterOption = document.createElement('option');
        filterOption.value = key;
        filterOption.textContent = value;
        filterMateria.appendChild(filterOption);
        
        // Formulário
        const editOption = document.createElement('option');
        editOption.value = key;
        editOption.textContent = value;
        editMateria.appendChild(editOption);
    });
}

// Configurar eventos
function configurarEventos() {
    // Filtros
    filterMateria.addEventListener('change', () => {
        popularAssuntosFiltro(filterMateria.value);
        carregarFlashcards();
    });

    filterAssunto.addEventListener('change', carregarFlashcards);

    // Botão adicionar
    addFlashcardBtn.addEventListener('click', mostrarFormularioCriacao);

    // Formulário
    editForm.addEventListener('submit', salvarFlashcard);
    cancelBtn.addEventListener('click', voltarParaLista);

    // Modal de exclusão
    cancelDeleteBtn.addEventListener('click', fecharModal);
    confirmDeleteBtn.addEventListener('click', confirmarExclusao);

    // Botão voltar
    backBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.location.href = 'index.html';
    });

    // Fechar modal ao clicar fora
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            fecharModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
}

// Popular assuntos no filtro
function popularAssuntosFiltro(materia) {
    filterAssunto.innerHTML = '<option value="">Todos</option>';
    
    if (!materia) return;

    const assuntos = getAssuntosPorMateria(materia);
    assuntos.forEach(assunto => {
        const option = document.createElement('option');
        option.value = assunto;
        option.textContent = assunto;
        filterAssunto.appendChild(option);
    });
}

// Carregar flashcards na tabela
function carregarFlashcards() {
    const materia = filterMateria.value;
    const assunto = filterAssunto.value;
    
    let flashcards = getFlashcards();
    
    if (materia) {
        flashcards = flashcards.filter(fc => fc.materia === materia);
    }
    
    if (assunto) {
        flashcards = flashcards.filter(fc => fc.assunto === assunto);
    }
    
    flashcardsTableBody.innerHTML = '';
    
    if (flashcards.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    flashcards.forEach(flashcard => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flashcard.id}</td>
            <td>${materias[flashcard.materia] || flashcard.materia}</td>
            <td>${flashcard.assunto}</td>
            <td>${flashcard.pergunta}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editarFlashcard(${flashcard.id})">Editar</button>
                    <button class="action-btn delete-btn" onclick="excluirFlashcard(${flashcard.id})">Excluir</button>
                </div>
            </td>
        `;
        flashcardsTableBody.appendChild(row);
    });
}

// Mostrar formulário de criação
function mostrarFormularioCriacao() {
    formTitle.textContent = 'Novo Flashcard';
    editId.value = '';
    editMateria.value = '';
    editAssunto.value = '';
    editPergunta.value = '';
    editResposta.value = '';
    
    flashcardsList.style.display = 'none';
    flashcardForm.style.display = 'block';
}

// Editar flashcard
function editarFlashcard(id) {
    const flashcards = getFlashcards();
    const flashcard = flashcards.find(fc => fc.id === id);
    
    if (!flashcard) return;
    
    formTitle.textContent = 'Editar Flashcard';
    editId.value = flashcard.id;
    editMateria.value = flashcard.materia;
    editAssunto.value = flashcard.assunto;
    editPergunta.value = flashcard.pergunta;
    editResposta.value = flashcard.resposta;
    
    flashcardsList.style.display = 'none';
    flashcardForm.style.display = 'block';
}

// Salvar flashcard
function salvarFlashcard(e) {
    e.preventDefault();
    
    const id = editId.value;
    const materia = editMateria.value;
    const assunto = editAssunto.value.trim();
    const pergunta = editPergunta.value.trim();
    const resposta = editResposta.value.trim();
    
    if (!materia || !assunto || !pergunta || !resposta) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }
    
    if (id) {
        // Editar existente
        editarFlashcardDB(parseInt(id), {
            materia,
            assunto,
            pergunta,
            resposta
        });
    } else {
        // Criar novo
        salvarFlashcardDB({
            materia,
            assunto,
            pergunta,
            resposta
        });
    }
    
    voltarParaLista();
    carregarFlashcards();
}

// Voltar para lista
function voltarParaLista() {
    flashcardForm.style.display = 'none';
    flashcardsList.style.display = 'block';
    editForm.reset();
}

// Excluir flashcard
function excluirFlashcard(id) {
    deleteId = id;
    confirmModal.style.display = 'flex';
}

// Fechar modal
function fecharModal() {
    confirmModal.style.display = 'none';
    deleteId = null;
}

// Confirmar exclusão
function confirmarExclusao() {
    if (deleteId) {
        excluirFlashcardDB(deleteId);
        fecharModal();
        carregarFlashcards();
    }
}

// Funções auxiliares para banco de dados
function salvarFlashcardDB(flashcard) {
    adicionarFlashcard(flashcard);
}

function editarFlashcardDB(id, dadosAtualizados) {
    editarFlashcard(id, dadosAtualizados);
}

function excluirFlashcardDB(id) {
    excluirFlashcard(id);
}
