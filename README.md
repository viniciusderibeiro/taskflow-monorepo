<div align="center">

# TaskFlow - Kanban

### Gestão de tarefas Kanban, fullstack, conteinerizada e deploy.

[![CI](https://github.com/viniciusderibeiro/taskflow-monorepo/actions/workflows/ci.yml/badge.svg)](https://github.com/viniciusderibeiro/taskflow-monorepo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

[**Issues - Propostas de melhorias**](https://github.com/viniciusderibeiro/taskflow-monorepo/issues)

</div>

---

## 📖 Sobre o Projeto

**TaskFlow** é um sistema de gestão de tarefas no estilo **Kanban**, construído como um **monorepo fullstack** para resolver uma dor real de times pequenos: **a falta de visibilidade sobre o que está sendo feito, por quem e em qual status**.

Planilhas viram bagunça, conversas em chat se perdem, e o resultado é retrabalho, prazos quebrados e ninguém sabe ao certo o que está pronto. O TaskFlow centraliza esse fluxo em **um quadro único, visual e em tempo real**, com autenticação segura e uma API REST documentada.

### 🎯 Objetivos do Projeto

- Entregar uma aplicação **fullstack funcional** seguindo práticas reais de mercado.
- Aplicar **metodologias ágeis** (Kanban + GitHub Projects) na própria construção do produto.
- Demonstrar domínio sobre **versionamento, CI/CD, conteinerização e arquitetura em camadas**.

---

## 🛠️ Arquitetura e Tecnologias

O TaskFlow segue uma arquitetura em **três camadas claramente separadas**, organizadas em um único repositório (monorepo) para facilitar o desenvolvimento cruzado entre front e back.

```
┌─────────────┐                ┌─────────────┐            ┌──────────────┐
    Cliente     ─────────────▶    Backend     ─────────▶    PostgreSQL   
   (Next.js)    ◀─────────────  (Spring API)  ◀─────────     (Neon DB)   
└─────────────┘                └─────────────┘            └──────────────┘
```

### 🎨 Frontend

> Construído com **Next.js 14**, utilizando componentes reutilizáveis e uma interface moderna baseada em conceitos sólidos de UI/UX.

| Tecnologia        | Função                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **Next.js 14**    | Framework React principal — roteamento, SSR/SSG, otimização de performance e SEO.               |
| **TypeScript**    | Tipagem estática sobre o JavaScript — autocompletar e prevenção de bugs em tempo de compilação. |
| **Tailwind CSS**  | Estilização utility-first para telas responsivas e consistentes em ritmo acelerado.             |
| **Zustand**       | Gerenciamento de estado global leve e sem boilerplate (ex: dados do usuário logado).            |
| **Zod**           | Validação de schemas em runtime — garante a integridade de dados de formulários e APIs.         |
| **Axios**         | Cliente HTTP para consumo da API REST do backend.                                               |
| **TanStack Query**| Cache, sincronização e refetch automático dos dados servidor ↔ UI.                              |

### ⚙️ Backend

> API REST construída em **Spring Boot 3** com arquitetura em camadas (Controller → Service → Repository), testes automatizados e documentação Swagger gerada automaticamente.

| Tecnologia                    | Função                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| **Spring Boot Web**           | Criação dos endpoints REST e tratamento das requisições HTTP.                                |
| **Spring Data JPA**           | ORM que abstrai o acesso ao banco — persistência sem SQL manual.                             |
| **PostgreSQL**                | Banco de dados relacional principal.                                                         |
| **Spring Validation**         | Validação declarativa de DTOs (`@NotNull`, `@Email`, `@Size`, etc.).                          |
| **Springdoc OpenAPI (Swagger)** | Geração automática da documentação interativa da API.                                      |
| **Spring Security + JWT**     | Autenticação stateless via tokens JWT e controle de autorização por rota.                    |
| **Lombok**                    | Reduz boilerplate (`@Getter`, `@Setter`, `@Builder`, etc.).                                  |
| **Spring Boot Actuator**      | Endpoints de health-check e monitoramento da aplicação em produção.                          |
| **Spring Boot Test + JUnit**  | Suíte de testes unitários e de integração.                                                   |

### 🔧 Infraestrutura e DevOps

| Ferramenta            | Função                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **Docker + Compose**  | Conteinerização da aplicação inteira Frontend, Backend, banco de dados sobem com um comando.          |
| **GitHub Actions**    | Pipeline de CI executando build e testes a cada `push` ou `pull request`.                        |
| **Vercel**            | Hospedagem do frontend com deploy automático e preview por PR.                                   |
| **Railway**           | Hospedagem do backend Spring Boot com monitoramento de requisições.                              |
| **Neon DB**           | PostgreSQL gerenciado em nuvem (serverless).                                                     |
| **Husky + Commitlint**| Hooks de Git que validam o padrão **Conventional Commits** antes de cada commit.                 |
| **ESLint + Prettier** | Linting e formatação automática do código frontend.                                              |

---

## ⚙️ Pré-requisitos

Antes de começar, garanta que os seguintes itens estejam instalados:

| Ferramenta         | Versão Recomendada | Verificar com         |
| ------------------ | ------------------ | --------------------- |
| **Node.js**        | `>= 20.x`          | `node --version`      |
| **npm** ou **pnpm**| `>= 10.x`          | `npm --version`       |
| **Java JDK**       | `21` (Eclipse Temurin recomendado) | `java --version` |
| **Maven**          | `>= 3.9`           | `mvn --version`       |
| **Docker**         | `>= 24.x`          | `docker --version`    |
| **Docker Compose** | `>= 2.x`           | `docker compose version` |
| **Git**            | `>= 2.40`          | `git --version`       |

> 💡 **Recomendado:** rodar tudo via **Docker Compose** para evitar conflitos de versão entre máquinas do squad. Instalações nativas são opcionais.

---

## 🚀 Instalação e Execução

### Opção 1 — Via Docker (Recomendado)

A forma mais rápida de subir o projeto inteiro (frontend + backend + banco + cache):

```bash
# 1. Clone o repositório
git clone https://github.com/viniciusderibeiro/taskflow-monorepo.git
cd taskflow-monorepo

# 2. Crie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Suba todos os serviços
docker compose up --build
```

Após o build, os serviços estarão disponíveis em:

| Serviço         | URL                                           |
| --------------- | --------------------------------------------- |
| 🎨 Frontend     | `http://localhost:3000`                       |
| ⚙️ Backend API  | `http://localhost:8080`                       |
| 📚 Swagger UI   | `http://localhost:8080/swagger-ui.html`       |
| 🗄️ PostgreSQL   | `localhost:5432`                              |

### Opção 2 — Execução Manual (Local)

#### Backend (Spring Boot)

```bash
cd backend/api

# Instale as dependências e compile
./mvnw clean install -DskipTests

# Rode a aplicação
./mvnw spring-boot:run
```

O backend ficará disponível em `http://localhost:8080`.

#### Frontend (Next.js)

```bash
cd frontend

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```

O frontend ficará disponível em `http://localhost:3000`.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# === Backend ===
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[insira_sua_senha_aqui]
JWT_SECRET=[gere_uma_chave_segura_de_pelo_menos_256_bits]
JWT_EXPIRATION=86400000
REDIS_HOST=localhost
REDIS_PORT=6379

# === Frontend ===
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> ⚠️ **Atenção:** nunca commite o arquivo `.env` com credenciais reais. O `.gitignore` já está configurado para ignorá-lo.

---

## 💻 Como Usar

Após subir a aplicação, acesse `http://localhost:3000` no navegador e:

1. **Crie sua conta** na tela de cadastro.
2. **Faça login** e acesse seu board pessoal.
3. **Crie tarefas** clicando em `+ Nova Tarefa`.
4. **Arraste e solte** entre as colunas **To Do → Doing → Done**.
5. **Edite ou exclua** tarefas a qualquer momento.

### 🌐 Principais Endpoints da API

> Documentação completa e interativa disponível em `/swagger-ui.html`

| Método   | Rota                       | Descrição                                     |
| -------- | -------------------------- | --------------------------------------------- |
| `POST`   | `/auth/register`           | Cadastrar um novo usuário.                    |
| `POST`   | `/auth/login`              | Autentica e retorna o token JWT.              |
| `GET`    | `/tasks`                   | Listar todas as tarefas do usuário.           |
| `POST`   | `/tasks`                   | Criar uma nova tarefa.                        |
| `GET`    | `/tasks/{id}`              | Buscar uma tarefa específica por ID.          |
| `PUT`    | `/tasks/{id}`              | Atualizar uma tarefa (dados completos).       |
| `PATCH`  | `/tasks/{id}/status`       | tualizar apenas o status de uma tarefa.       |
| `PATCH`  | `/tasks/{id}/priority`     | Atualizar apenas a prioridade de uma tarefa.  |
| `DELETE` | `/tasks/{id}`              | Remove uma tarefa.                            |

---

## 📂 Estrutura de Diretórios

```
taskflow-monorepo/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline de CI no GitHub Actions
├── .husky/                         # Hooks de Git (commit-msg, pre-commit)
├── backend/
│   └── api/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/           # Código-fonte Spring Boot
│       │   │   │   ├── config/     # Configurações (Security, CORS, Swagger)
│       │   │   │   ├── controller/ # Endpoints REST
│       │   │   │   ├── service/    # Regras de negócio
│       │   │   │   ├── repository/ # Acesso ao banco (JPA)
│       │   │   │   ├── entity/     # Entidades JPA
│       │   │   │   └── dto/        # Data Transfer Objects
│       │   │   └── resources/
│       │   │       └── application.yml
│       │   └── test/               # Testes unitários e de integração
│       ├── Dockerfile
│       └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/                    # App Router do Next.js 14
│   │   ├── components/             # Componentes React reutilizáveis
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilitários e configuração do Axios
│   │   ├── stores/                 # Stores do Zustand
│   │   └── schemas/                # Schemas Zod
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
├── .editorconfig
├── .gitignore
├── commitlint.config.js
├── docker-compose.yml              # Orquestração de todos os serviços
├── LICENSE
├── package.json                    # Workspace raiz do monorepo
└── README.md
```

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Siga os passos abaixo para enviar a sua:

1. **Faça um Fork** do projeto.
2. **Crie uma branch** para sua feature ou correção:
   ```bash
   git checkout -b feature/minha-nova-feature
   ```
3. **Faça commits seguindo o padrão Conventional Commits**:
   ```bash
   git commit -m "feat: adiciona endpoint de exportação CSV"
   ```
4. **Envie para o seu fork**:
   ```bash
   git push origin feature/minha-nova-feature
   ```
5. **Abra um Pull Request** descrevendo claramente:
   - O que mudou e por quê.
   - Como testar.
   - Screenshots, se houver mudança visual.

### 📝 Padrão de Commits

Este projeto segue o [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo     | Quando usar                                      |
| ----------- | ------------------------------------------------ |
| `feat:`     | Nova funcionalidade.                             |
| `fix:`      | Correção de bug.                                 |
| `docs:`     | Mudanças apenas na documentação.                 |
| `style:`    | Formatação, ponto-e-vírgula, espaços (sem código).|
| `refactor:` | Refatoração sem mudança de comportamento.        |
| `test:`     | Adição ou ajuste de testes.                      |
| `chore:`    | Tarefas de manutenção (build, deps, etc.).       |

> Toda PR passa pelo CI antes de ser elegível para merge. Builds quebrados não são aceitos na `main`.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](./LICENSE) para mais detalhes.

---

## 👤 Contato

**Vinicius de Ribeiro**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/viniciusderibeiro/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/viniciusderibeiro)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=flat&logo=vercel&logoColor=white)](https://viniciusderibeiro.vercel.app)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:viniciusderibeiro.work@gmail.com)

---

<div align="center">

⭐ **Se este projeto te ajudou de alguma forma, considere deixar uma estrela!** ⭐

</div>
