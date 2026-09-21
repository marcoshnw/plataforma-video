// Gerenciamento de dados de Flashcards usando localStorage

// Dados iniciais de exemplo
const flashcardsIniciais = [
    {
        id: 1,
        materia: "portugues",
        assunto: "Classes Gramaticais",
        pergunta: "O que é um substantivo?",
        resposta: "Substanttivo é a palavra que nomeia seres, objetos, lugares, sentimentos, ideias, etc."
    },
    {
        id: 2,
        materia: "portugues",
        assunto: "Classes Gramaticais",
        pergunta: "Quais são as três classes de adjetivos?",
        resposta: "Adjetivos simples, compostos e pronominais."
    },
    {
        id: 3,
        materia: "portugues",
        assunto: "Classes Gramaticais",
        pergunta: "O que é um verbo?",
        resposta: "Verbo é a palavra que indica ação, estado ou fenômeno."
    },
    {
        id: 4,
        materia: "informatica",
        assunto: "Windows",
        pergunta: "Qual é o atalho para copiar no Windows?",
        resposta: "Ctrl + C"
    },
    {
        id: 5,
        materia: "informatica",
        assunto: "Windows",
        pergunta: "Qual é o atalho para colar no Windows?",
        resposta: "Ctrl + V"
    },
    {
        id: 6,
        materia: "informatica",
        assunto: "Excel",
        pergunta: "Qual é a função para somar no Excel?",
        resposta: "=SOMA()"
    },
    {
        id: 7,
        materia: "direito-constitucional",
        assunto: "Conceitos Fundamentais",
        pergunta: "O que é o poder constituinte originário?",
        resposta: "É o poder que cria uma nova Constituição, sem limitações jurídicas anteriores."
    },
    {
        id: 8,
        materia: "direito-constitucional",
        assunto: "Direitos Fundamentais",
        pergunta: "Qual é o artigo que trata dos direitos e garantias fundamentais?",
        resposta: "Artigo 5º da Constituição Federal."
    },
    {
        id: 9,
        materia: "direito-administrativo",
        assunto: "Atos Administrativos",
        pergunta: "Quais são os elementos do ato administrativo?",
        resposta: "Competência, finalidade, forma, motivo, objeto e conteúdo."
    },
    {
        id: 10,
        materia: "legislacao",
        assunto: "Lei 8.112/90",
        pergunta: "O que regula a Lei 8.112/90?",
        resposta: "Regime jurídico dos servidores públicos civis da União."
    },
    {
        id: 11,
        materia: "conhecimentos-gerais",
        assunto: "Geografia",
        pergunta: "Qual é a capital do Brasil?",
        resposta: "Brasília."
    },
    {
        id: 12,
        materia: "conhecimentos-gerais",
        assunto: "História",
        pergunta: "Em que ano o Brasil foi descoberto?",
        resposta: "1500."
    }
];

// Mapeamento de matérias para exibição
const materias = {
    "portugues": "Português",
    "informatica": "Informática",
    "direito-constitucional": "Direito Constitucional",
    "direito-administrativo": "Direito Administrativo",
    "legislacao": "Legislação",
    "conhecimentos-gerais": "Conhecimentos Gerais"
};

// Inicializar dados no localStorage
function inicializarFlashcards() {
    if (!localStorage.getItem('flashcards')) {
        localStorage.setItem('flashcards', JSON.stringify(flashcardsIniciais));
    }
}

// Obter todos os flashcards
function getFlashcards() {
    inicializarFlashcards();
    return JSON.parse(localStorage.getItem('flashcards')) || [];
}

// Salvar flashcards
function salvarFlashcards(flashcards) {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Obter flashcards por matéria
function getFlashcardsPorMateria(materia) {
    const flashcards = getFlashcards();
    return flashcards.filter(fc => fc.materia === materia);
}

// Obter flashcards por matéria e assunto
function getFlashcardsPorMateriaAssunto(materia, assunto) {
    const flashcards = getFlashcards();
    return flashcards.filter(fc => fc.materia === materia && fc.assunto === assunto);
}

// Obter assuntos únicos de uma matéria
function getAssuntosPorMateria(materia) {
    const flashcards = getFlashcardsPorMateria(materia);
    const assuntos = [...new Set(flashcards.map(fc => fc.assunto))];
    return assuntos.sort();
}

// Adicionar novo flashcard
function adicionarFlashcard(flashcard) {
    const flashcards = getFlashcards();
    const novoId = flashcards.length > 0 ? Math.max(...flashcards.map(fc => fc.id)) + 1 : 1;
    flashcards.push({
        id: novoId,
        ...flashcard
    });
    salvarFlashcards(flashcards);
    return novoId;
}

// Editar flashcard
function editarFlashcard(id, dadosAtualizados) {
    const flashcards = getFlashcards();
    const index = flashcards.findIndex(fc => fc.id === id);
    if (index !== -1) {
        flashcards[index] = { ...flashcards[index], ...dadosAtualizados };
        salvarFlashcards(flashcards);
        return true;
    }
    return false;
}

// Excluir flashcard
function excluirFlashcard(id) {
    const flashcards = getFlashcards();
    const novosFlashcards = flashcards.filter(fc => fc.id !== id);
    salvarFlashcards(novosFlashcards);
}

// Embaralhar array (Fisher-Yates)
function embaralharArray(array) {
    const arrayCopiado = [...array];
    for (let i = arrayCopiado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopiado[i], arrayCopiado[j]] = [arrayCopiado[j], arrayCopiado[i]];
    }
    return arrayCopiado;
}

// Inicializar ao carregar
inicializarFlashcards();
