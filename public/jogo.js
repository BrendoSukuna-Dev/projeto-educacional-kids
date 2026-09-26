let listaCompleta = [];
let baralhoJogo = [];
let indiceAtual = 0;
let modoAleatorio = false;
let bloqueado = false;

// Elementos do DOM
const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const btnIniciarJogo = document.getElementById("btn-iniciar-jogo");
const modoContainer = document.getElementById("modo-container");

const imgPergunta = document.getElementById("imagem-pergunta");
const btnAudioPergunta = document.getElementById("btn-audio-pergunta");
const containerOpcoes = document.getElementById("container-opcoes");
const feedbackMsg = document.getElementById("feedback-mensagem");
const progressoInfo = document.getElementById("progresso-info");
const btnAlternarModo = document.getElementById("btn-alternar-modo");

// Busca os dados da API em segundo plano
async function carregarDados() {
  try {
    const res = await fetch("/api/jogo-alfabeto");
    listaCompleta = await res.json();
    prepararBaralho();
  } catch (err) {
    console.error("Erro ao carregar o jogo:", err);
  }
}

// Quando o usuário clica no botão "Começar o Jogo"
btnIniciarJogo.onclick = () => {
  telaInicial.style.display = "none";
  telaJogo.style.display = "flex";
  modoContainer.style.display = "flex";

  // Inicia a primeira questão e toca o som
  carregarQuestao();
};

function prepararBaralho() {
  baralhoJogo = [...listaCompleta];
  if (modoAleatorio) {
    for (let i = baralhoJogo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baralhoJogo[i], baralhoJogo[j]] = [baralhoJogo[j], baralhoJogo[i]];
    }
  }
  indiceAtual = 0;
}

function carregarQuestao() {
  bloqueado = false;
  feedbackMsg.textContent = "";

  const itemAtual = baralhoJogo[indiceAtual];

  imgPergunta.src = itemAtual.imagemPergunta;
  imgPergunta.onerror = (e) => {
    e.target.onerror = null; // Trava o loop de erros
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 250 250"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" font-size="24" font-weight="bold" fill="%23555" dominant-baseline="middle" text-anchor="middle">${itemAtual.palavra}</text></svg>`;
  };

  btnAudioPergunta.onclick = () => tocarAudio(itemAtual.somPergunta);

  // Áudio da pergunta com pausa de 800ms ao carregar a tela
  setTimeout(() => {
    tocarAudio(itemAtual.somPergunta);
  }, 800);

  progressoInfo.textContent = `Letra ${indiceAtual + 1} de ${baralhoJogo.length}`;
  gerarAlternativas(itemAtual);
}

function gerarAlternativas(itemCorreto) {
  containerOpcoes.innerHTML = "";
  const outrasLetras = listaCompleta.filter(
    (i) => i.letra !== itemCorreto.letra,
  );

  const falsasSorteadas = [];
  while (falsasSorteadas.length < 2 && outrasLetras.length > 0) {
    const idxSorteado = Math.floor(Math.random() * outrasLetras.length);
    const itemRemovido = outrasLetras.splice(idxSorteado, 1)[0];
    falsasSorteadas.push(itemRemovido);
  }

  const opcoes = [itemCorreto, ...falsasSorteadas];
  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach((opcao) => {
    const btn = document.createElement("button");
    btn.className = "btn-opcao";
    btn.style.borderColor = itemCorreto.corHex;

    const img = document.createElement("img");
    img.src = opcao.imagemLetraCorreta;
    img.alt = `Letra ${opcao.letra}`;
    img.onerror = (e) => {
      e.target.onerror = null; // Trava o loop de erros
      img.style.display = "none";
      btn.innerHTML = `<span style="font-size: 2.5rem; font-weight: bold; color: ${itemCorreto.corHex}">${opcao.letra}</span>`;
    };

    btn.appendChild(img);
    btn.onclick = () => verificarResposta(opcao.letra, itemCorreto);
    containerOpcoes.appendChild(btn);
  });
}

function verificarResposta(letraSelecionada, itemCorreto) {
  if (bloqueado) return;

  if (letraSelecionada === itemCorreto.letra) {
    bloqueado = true;
    feedbackMsg.style.color = "#2ecc71";
    feedbackMsg.textContent = "🌟 Muito bem! Você acertou!";

    // Toca o áudio de acerto e só avança QUANDO O ÁUDIO TERMINAR
    tocarAudioComCallback(itemCorreto.somAcerto, () => {
      setTimeout(() => {
        indiceAtual++;
        if (indiceAtual >= baralhoJogo.length) {
          alert("🎉 Parabéns! Você completou todas as letras do alfabeto!");
          prepararBaralho();
        }
        carregarQuestao();
      }, 800);
    });
  } else {
    feedbackMsg.style.color = "#e74c3c";
    feedbackMsg.textContent = "Ops! Tente novamente.";

    // Toca o som de erro específico da letra (ex: erro-a.mp3)
    tocarAudio(itemCorreto.somErro);
  }
}

function tocarAudio(caminho) {
  if (!caminho) return;
  const audio = new Audio(caminho);
  audio.play().catch((e) => console.warn("Áudio não carregado:", caminho));
}

// Função especial que aguarda o áudio chegar ao fim antes de executar o callback
function tocarAudioComCallback(caminho, aoTerminar) {
  if (!caminho) {
    if (aoTerminar) aoTerminar();
    return;
  }

  const audio = new Audio(caminho);

  audio.onended = () => {
    if (aoTerminar) aoTerminar();
  };

  audio.play().catch((e) => {
    console.warn("Áudio não carregado:", caminho);
    if (aoTerminar) aoTerminar();
  });
}

btnAlternarModo.onclick = () => {
  modoAleatorio = !modoAleatorio;
  btnAlternarModo.textContent = modoAleatorio
    ? "Aleatório (Embaralhado)"
    : "Sequencial (A-Z)";
  prepararBaralho();
  carregarQuestao();
};

// Inicia o carregamento dos dados
carregarDados();
