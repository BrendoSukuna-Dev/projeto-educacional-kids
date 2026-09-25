const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do express-session
app.use(
  session({
    secret: "segredo-super-seguro-mundo-sons-cores",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configuração do Multer para salvar uploads nas pastas corretas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "imagem") {
      cb(null, "public/imagens");
    } else if (file.fieldname === "som") {
      cb(null, "public/sons");
    } else {
      cb(null, "public/uploads");
    }
  },
  filename: function (req, file, cb) {
    // Mantém o nome original ou padroniza a extensão
    const ext = path.extname(file.originalname);
    const nomeLimpo = req.body.nome
      ? req.body.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
      : Date.now();
    cb(null, `${nomeLimpo}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage: storage });

// Middleware para checar se o usuário está logado como admin
function autenticarAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res
    .status(401)
    .json({ erro: "Acesso não autorizado. Faça login primeiro." });
}

// ------------------- ROTAS -------------------

// 1. Rota de leitura dos itens (Pública)
app.get("/api/itens", (req, res) => {
  fs.readFile(
    path.join(__dirname, "data", "itens.json"),
    "utf8",
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ erro: "Erro ao ler os dados do servidor." });
      }
      res.json(JSON.parse(data));
    },
  );
});

// 2. Rota de Login do Admin
app.post("/api/login", (req, res) => {
  const { usuario, senha } = req.body;

  // Defina seu usuário e senha de administrador aqui
  if (usuario === "admin" && senha === "131607Bb") {
    req.session.isAdmin = true;
    return res.json({
      sucesso: true,
      mensagem: "Login realizado com sucesso!",
    });
  }

  return res.status(401).json({ erro: "Usuário ou senha incorretos!" });
});

// 3. Rota de Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ sucesso: true });
});

// 4. Rota para cadastrar novo item (Protegida)
app.post(
  "/api/itens",
  autenticarAdmin,
  upload.fields([
    { name: "imagem", maxCount: 1 },
    { name: "som", maxCount: 1 },
  ]),
  (req, res) => {
    const { nome, categoria } = req.body;

    if (!nome || !categoria || !req.files["imagem"] || !req.files["som"]) {
      return res
        .status(400)
        .json({ erro: "Todos os campos e arquivos são obrigatórios!" });
    }

    const caminhoJson = path.join(__dirname, "data", "itens.json");

    fs.readFile(caminhoJson, "utf8", (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ erro: "Erro ao acessar o arquivo de dados." });
      }

      const itens = JSON.parse(data);

      // Gerar um ID incremental
      const novoId =
        itens.length > 0 ? Math.max(...itens.map((i) => i.id)) + 1 : 1;

      const novoItem = {
        id: novoId,
        nome: nome,
        categoria: categoria.toLowerCase(),
        imagem: `imagens/${req.files["imagem"][0].filename}`,
        somNome: `sons/${req.files["som"][0].filename}`,
      };

      itens.push(novoItem);

      fs.writeFile(caminhoJson, JSON.stringify(itens, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ erro: "Erro ao salvar o novo item." });
        }
        res.json({ sucesso: true, item: novoItem });
      });
    });
  },
);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); //testando
});
