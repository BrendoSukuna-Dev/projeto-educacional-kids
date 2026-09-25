<div align="center">

# 🎨 Mundo dos Sons e Cores 🎵

**Uma plataforma web interativa voltada para a educação infantil e alfabetização lúdica.**

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 📌 Sobre o Projeto

O **Mundo dos Sons e Cores** é uma aplicação Full-Stack desenvolvida para auxiliar o aprendizado e a assimilação de novos conceitos por crianças em idade pré-escolar. Através de cards visuais interativos, a criança clica no elemento desejado e ouve a pronúncia direta e clara associada à imagem.

O sistema conta com padronização visual das ilustrações e vozes gravadas via Inteligência Artificial, garantindo coesão estética e tonalidade agradável para a escuta infantil.

---

## ✨ Funcionalidades

### 👧 Área do Aluno (Front-End)
* **Cards Interativos:** Reprodução instantânea de áudios educativos ao clicar nos elementos.
* **Filtro por Categorias:** Organização por tópicos dinâmicos: *Folclore*, *Animais*, *Cores*, *Alfabeto* e *Objetos*.
* **Design Acessível:** Interface limpa, colorida e adaptada para navegação intuitiva de crianças.

### 🔐 Painel Administrativo (Back-End)
* **Autenticação Segura:** Acesso restrito via sessão (`express-session`) protegido por login e senha.
* **Upload Direto de Mídias:** Inserção prática de imagens e áudios utilizando o middleware `multer`.
* **Persistência Dinâmica:** Atualização do banco de dados em formato `JSON` sem necessidade de interrupção do servidor.
* **UX Administrativa:** Visualizador de senha embutido (toggle show/hide) e navegação facilitada de retorno à página principal.

---

## 🛠️ Tecnologias Utilizadas

### Front-End
* **HTML5 & CSS3:** Estrutura semântica e estilização customizada com foco em acessibilidade e responsividade.
* **JavaScript (Vanilla):** Manipulação de DOM, filtragem em memória e reprodução instantânea de áudio.

### Back-End
* **Node.js & Express:** Construção da API REST e servidor de arquivos estáticos.
* **Multer:** Processamento e armazenamento de uploads (`multipart/form-data`).
* **Express-Session:** Gerenciamento de sessões de usuário e proteção de rotas privadas.

---

## 📂 Estrutura de Pastas

```filetree
mundo-sons-cores/
├── data/
│   └── itens.json          # Banco de dados em JSON
├── public/
│   ├── imagens/            # Repositório estático de imagens
│   ├── sons/               # Repositório estático de áudios
│   ├── admin.html          # Interface do Painel Administrativo
│   ├── app.js              # Lógica de renderização e filtros
│   ├── index.html          # Interface principal (Área do Aluno)
│   └── style.css           # Estilização global da aplicação
├── index.js                # Servidor Node.js / Express e rotas da API
├── package.json            # Dependências e scripts do projeto
└── README.md               # Documentação do projeto
