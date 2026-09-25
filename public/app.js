const API_URL = "/api/itens";
let todosOsItens = []; // Guarda a lista completa vinda do servidor

// Função para buscar os itens no servidor
async function buscarItens() {
  try {
    const resposta = await fetch(API_URL);
    todosOsItens = await resposta.json();

    // Ao carregar pela primeira vez, exibe todos
    filtrarCategoria("todos");
  } catch (erro) {
    console.error("Erro ao buscar os itens:", erro);
  }
}

// Função para renderizar os cartões na tela
function renderizarCards(itens) {
  const container = document.getElementById("grid-itens");
  container.innerHTML = "";

  if (itens.length === 0) {
    container.innerHTML =
      "<p style='grid-column: 1/-1; color: #777;'>Nenhum item encontrado nesta categoria.</p>";
    return;
  }

  itens.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    // Ao clicar no card, reproduz o áudio do nome
    card.onclick = () => tocarSom(item.somNome);

    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="card-img" onerror="this.src='https://via.placeholder.com/150?text=${item.nome}'">
      <h3>${item.nome}</h3>
    `;

    container.appendChild(card);
  });
}

// Função para filtrar por categoria e atualizar visualmente os botões
function carregarItens(categoria) {
  filtrarCategoria(categoria);
}

function filtrarCategoria(categoria) {
  if (categoria === "todos") {
    renderizarCards(todosOsItens);
  } else {
    const itensFiltrados = todosOsItens.filter(
      (item) => item.categoria.toLowerCase() === categoria.toLowerCase(),
    );
    renderizarCards(itensFiltrados);
  }
}

// Função para reproduzir o áudio
function tocarSom(caminhoAudio) {
  if (caminhoAudio) {
    const audio = new Audio(caminhoAudio);
    audio.play().catch((erro) => {
      console.warn("Erro ou arquivo de áudio não encontrado:", erro);
    });
  }
}

// Carregar todos os itens ao iniciar a página
buscarItens();
