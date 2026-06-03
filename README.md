<div align="center">

# TaskFlow - Kanban

[![CI](https://github.com/viniciusderibeiro/taskflow-monorepo/actions/workflows/ci.yml/badge.svg)](https://github.com/viniciusderibeiro/taskflow-monorepo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

**TaskFlow** is a modern, full-stack, and fully containerized Kanban task management platform.

[🐛 Report a Bug / Feature Request](https://github.com/viniciusderibeiro/taskflow-monorepo/issues) • [⭐ Support this project with a star!](https://github.com/viniciusderibeiro/taskflow-monorepo)

</div>

## 🌐 Documentation / Documentação

<details id="english">
<summary>🇺🇸 <b>English (click to learn more)</b></summary>

## 📖 About the Project

**TaskFlow** is a **Kanban-style task management system** built as a **fullstack monorepo** to solve a real pain point for small teams: **the lack of visibility into what's being done, by whom, and at which stage**.

Spreadsheets turn into chaos, chat messages get lost, and the result is rework, missed deadlines, and no one really knowing what's done. TaskFlow centralizes this workflow into **a single, visual, real-time board**, with secure authentication and a fully documented REST API.

### 🎯 Project Goals

- Deliver a **fully functional fullstack application** following real industry practices.
- Apply **agile methodologies** (Kanban + GitHub Projects) in the product's own development cycle.
- Demonstrate proficiency in **versioning, CI/CD, containerization, and layered architecture**.

---

## 🛠️ Architecture & Technologies

TaskFlow follows a **three-layer architecture clearly separated** into a single repository (monorepo), making cross-team development between frontend and backend straightforward.

### 🎨 Frontend

> Built with **Next.js 14**, using reusable components and a modern interface grounded in solid UI/UX principles.

| Technology        | Purpose                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **Next.js 14**    | Main React framework routing, SSR/SSG, performance and SEO optimization.                       |
| **TypeScript**    | Static typing over JavaScript autocomplete and compile-time bug prevention.                   |
| **Tailwind CSS**  | Utility-first styling for responsive, consistent screens at fast pace.                           |
| **Zustand**       | Lightweight global state management with no boilerplate (e.g. logged-in user data).             |
| **Zod**           | Runtime schema validation ensures data integrity from forms and APIs.                          |
| **Axios**         | HTTP client for consuming the backend REST API.                                                  |
| **TanStack Query**| Caching, synchronization, and automatic refetch of server ↔ UI data.                            |
| **React Markdown**| Safely renders text and content in Markdown format.                                              |
| **Remark GFM**    | React Markdown plugin that adds support for tables, auto-links, and checklists.                  |
| **Lucide React**  | Clean, modern SVG icon library, easily customizable via props.                                   |

### ⚙️ Backend

> REST API built with **Spring Boot 3** using layered architecture (Controller → Service → Repository), automated tests, and auto-generated Swagger documentation.

| Technology                     | Purpose                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| **Spring Boot Web**            | REST endpoint creation and HTTP request handling.                                             |
| **Spring Data JPA**            | ORM that abstracts database access persistence without manual SQL.                          |
| **PostgreSQL**                 | Primary relational database.                                                                  |
| **Spring Validation**          | Declarative DTO validation (`@NotNull`, `@Email`, `@Size`, etc.).                             |
| **Springdoc OpenAPI (Swagger)**| Automatic generation of interactive API documentation.                                        |
| **Spring Security + JWT**      | Stateless authentication via JWT tokens and route-level authorization control.                |
| **Lombok**                     | Reduces boilerplate (`@Getter`, `@Setter`, `@Builder`, etc.).                                 |
| **Spring Boot Actuator**       | Health-check and monitoring endpoints for production.                                         |
| **Spring Boot Test + JUnit**   | Unit and integration test suite.                                                              |

### 🔧 Infrastructure & DevOps

| Tool                  | Purpose                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **Docker + Compose**  | Full application containerization frontend, backend, and database spin up with a single command.|
| **GitHub Actions**    | CI pipeline running build and tests on every `push` or `pull request`.                           |
| **Vercel**            | Frontend hosting with automatic deploy and per-PR preview environments.                          |
| **Railway**           | Spring Boot backend hosting with request monitoring.                                             |
| **Neon DB**           | Managed serverless PostgreSQL in the cloud.                                                      |
| **Husky + Commitlint**| Git hooks that enforce the **Conventional Commits** standard before each commit.                 |
| **ESLint + Prettier** | Frontend code linting and automatic formatting.                                                  |

---

## ⚙️ Prerequisites

Make sure the following tools are installed before starting:

| Tool               | Recommended Version               | Verify with              |
| ------------------ | --------------------------------- | ------------------------ |
| **Node.js**        | `>= 20.x`                         | `node --version`         |
| **npm** or **pnpm**| `>= 10.x`                         | `npm --version`          |
| **Java JDK**       | `21` (Eclipse Temurin recommended)| `java --version`         |
| **Maven**          | `>= 3.9`                          | `mvn --version`          |
| **Docker**         | `>= 24.x`                         | `docker --version`       |
| **Docker Compose** | `>= 2.x`                          | `docker compose version` |
| **Git**            | `>= 2.40`                         | `git --version`          |

> 💡 **Recommended:** run everything via **Docker Compose** to avoid version conflicts across machines. Native installations are optional.

---

## 🚀 Installation & Setup

### Option 1 — Via Docker (Recommended)

The fastest way to bring up the entire project (frontend + backend + database + cache):

### 1. Clone the repository

```bash
git clone https://github.com/viniciusderibeiro/taskflow-monorepo.git
cd taskflow-monorepo
```

### 2. Create the environment variables file

Create a `.env` file at the project root based on `.env.example`:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[your_password_here]
JWT_SECRET=[generate_a_secure_key_of_at_least_256_bits]
JWT_EXPIRATION=86400000
REDIS_HOST=localhost
REDIS_PORT=6379
```

> ⚠️ **Warning:** never commit your `.env` file with real credentials. The `.gitignore` is already configured to ignore it.

### 3. Start all services

```bash
docker compose up --build
```

After the build, services will be available at:

| Service         | URL                                           |
| --------------- | --------------------------------------------- |
| 🎨 Frontend     | `http://localhost:3000`                       |
| ⚙️ Backend API  | `http://localhost:8080`                       |
| 📚 Swagger UI   | `http://localhost:8080/swagger-ui.html`       |
| 🗄️ PostgreSQL   | `localhost:5432`                              |

## Option 2 — Manual (Local)

### Backend (Spring Boot)

```bash
cd backend/api
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080`.

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 💻 Usage

After starting the application, access `http://localhost:3000` in your browser and:

1. **Create your account** on the registration screen.
2. **Log in** and access your personal board.
3. **Create tasks** by clicking `+ New Task`.
4. **Drag and drop** between columns: **To Do → Doing → Done**.
5. **Edit or delete** tasks at any time.

### 🌐 Main API Endpoints

> Full interactive documentation available at `/swagger-ui.html`

| Method   | Route                      | Description                                   |
| -------- | -------------------------- | --------------------------------------------- |
| `POST`   | `/auth/register`           | Register a new user.                          |
| `POST`   | `/auth/login`              | Authenticates and returns the JWT token.      |
| `GET`    | `/tasks`                   | List all tasks for the authenticated user.    |
| `POST`   | `/tasks`                   | Create a new task.                            |
| `GET`    | `/tasks/{id}`              | Retrieve a specific task by ID.               |
| `PUT`    | `/tasks/{id}`              | Update a task (full payload).                 |
| `PATCH`  | `/tasks/{id}/status`       | Update only the status of a task.             |
| `PATCH`  | `/tasks/{id}/priority`     | Update only the priority of a task.           |
| `DELETE` | `/tasks/{id}`              | Delete a task.                                |

---

## 📂 Directory Structure

```
taskflow-monorepo/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── .husky/                         # Git hooks (commit-msg, pre-commit)
├── backend/
│   └── api/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   ├── config/     # Configurations (Security, CORS, Swagger)
│       │   │   │   ├── controller/ # REST endpoints
│       │   │   │   ├── service/    # Business rules
│       │   │   │   ├── repository/ # Database access (JPA)
│       │   │   │   ├── entity/     # JPA entities
│       │   │   │   └── dto/        # Data Transfer Objects
│       │   │   └── resources/
│       │   │       └── application.yml
│       │   └── test/               # Unit and integration tests
│       ├── Dockerfile
│       └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js 14 App Router
│   │   ├── components/             # Reusable React components
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilities and Axios configuration
│   │   ├── stores/                 # Zustand stores
│   │   └── schemas/                # Zod schemas
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
├── .editorconfig
├── .gitignore
├── commitlint.config.js
├── docker-compose.yml
├── LICENSE
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are very welcome! Follow the steps below to submit yours:

1. **Fork** the project.
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Commit following the Conventional Commits standard**:
   ```bash
   git commit -m "feat: add CSV export endpoint"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```
5. **Open a Pull Request** clearly describing what changed, how to test it, and include screenshots for visual changes.

### 📝 Commit Standards

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | When to use                                    |
| ----------- | ---------------------------------------------- |
| `feat:`     | New feature.                                   |
| `fix:`      | Bug fix.                                       |
| `docs:`     | Documentation-only changes.                    |
| `style:`    | Formatting, semicolons, whitespace (no logic). |
| `refactor:` | Refactoring without behavior change.           |
| `test:`     | Adding or adjusting tests.                     |
| `chore:`    | Maintenance tasks (build, deps, etc.).         |

> Every PR goes through CI before being eligible for merge. Broken builds are not accepted into `main`.

---

## 📄 License

Distributed under the **MIT** license. See the [`LICENSE`](./LICENSE) file for more details.

---

## 👤 Contact

**Vinicius de Ribeiro**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/viniciusderibeiro/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/viniciusderibeiro)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=flat&logo=vercel&logoColor=white)](https://viniciusderibeiro.vercel.app)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:viniciusderibeiro.work@gmail.com)

</details>

<details id="portugues">
<summary>🇧🇷 <b>Português (clique para saber mais)</b></summary>

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

### 🎨 Frontend

> Construído com **Next.js 14**, utilizando componentes reutilizáveis e uma interface moderna baseada em conceitos sólidos de UI/UX.

| Tecnologia         | Função                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Next.js 14**     | Framework React principal roteamento, SSR/SSG, otimização de performance e SEO.               |
| **TypeScript**     | Tipagem estática sobre o JavaScript autocompletar e prevenção de bugs em tempo de compilação. |
| **Tailwind CSS**   | Estilização utility-first para telas responsivas e consistentes em ritmo acelerado.             |
| **Zustand**        | Gerenciamento de estado global leve e sem boilerplate (ex: dados do usuário logado).            |
| **Zod**            | Validação de schemas em runtime garante a integridade de dados de formulários e APIs.         |
| **Axios**          | Cliente HTTP para consumo da API REST do backend.                                               |
| **TanStack Query** | Cache, sincronização e refetch automático dos dados servidor ↔ UI.                              |
| **React Markdown** | Renderiza textos e conteúdos em formato Markdown de forma segura.                               |
| **Remark GFM**     | Plugin do React Markdown que adiciona suporte a tabelas, links automáticos e checklists.        |
| **Lucide React**   | Pacote de ícones SVG limpos, modernos e fáceis de customizar via props.                         |

### ⚙️ Backend

> API REST construída em **Spring Boot 3** com arquitetura em camadas (Controller → Service → Repository), testes automatizados e documentação Swagger gerada automaticamente.

| Tecnologia                     | Função                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| **Spring Boot Web**            | Criação dos endpoints REST e tratamento das requisições HTTP.                                |
| **Spring Data JPA**            | ORM que abstrai o acesso ao banco persistência sem SQL manual.                             |
| **PostgreSQL**                 | Banco de dados relacional principal.                                                         |
| **Spring Validation**          | Validação declarativa de DTOs (`@NotNull`, `@Email`, `@Size`, etc.).                         |
| **Springdoc OpenAPI (Swagger)**| Geração automática da documentação interativa da API.                                        |
| **Spring Security + JWT**      | Autenticação stateless via tokens JWT e controle de autorização por rota.                    |
| **Lombok**                     | Reduz boilerplate (`@Getter`, `@Setter`, `@Builder`, etc.).                                  |
| **Spring Boot Actuator**       | Endpoints de health-check e monitoramento da aplicação em produção.                          |
| **Spring Boot Test + JUnit**   | Suíte de testes unitários e de integração.                                                   |

### 🔧 Infraestrutura e DevOps

| Ferramenta            | Função                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **Docker + Compose**  | Conteinerização da aplicação inteira frontend, backend e banco sobem com um comando.           |
| **GitHub Actions**    | Pipeline de CI executando build e testes a cada `push` ou `pull request`.                        |
| **Vercel**            | Hospedagem do frontend com deploy automático e preview por PR.                                   |
| **Railway**           | Hospedagem do backend Spring Boot com monitoramento de requisições.                              |
| **Neon DB**           | PostgreSQL gerenciado em nuvem (serverless).                                                     |
| **Husky + Commitlint**| Hooks de Git que validam o padrão **Conventional Commits** antes de cada commit.                 |
| **ESLint + Prettier** | Linting e formatação automática do código frontend.                                              |

---

## ⚙️ Pré-requisitos

Antes de começar, garanta que os seguintes itens estejam instalados:

| Ferramenta         | Versão Recomendada                        | Verificar com            |
| ------------------ | ----------------------------------------- | ------------------------ |
| **Node.js**        | `>= 20.x`                                 | `node --version`         |
| **npm** ou **pnpm**| `>= 10.x`                                 | `npm --version`          |
| **Java JDK**       | `21` (Eclipse Temurin recomendado)        | `java --version`         |
| **Maven**          | `>= 3.9`                                  | `mvn --version`          |
| **Docker**         | `>= 24.x`                                 | `docker --version`       |
| **Docker Compose** | `>= 2.x`                                  | `docker compose version` |
| **Git**            | `>= 2.40`                                 | `git --version`          |

> 💡 **Recomendado:** rodar tudo via **Docker Compose** para evitar conflitos de versão entre máquinas do squad. Instalações nativas são opcionais.

---

## 🚀 Instalação e Execução

### Opção 1 — Via Docker (Recomendado)

### 1. Clone o repositório

```bash
git clone https://github.com/viniciusderibeiro/taskflow-monorepo.git
cd taskflow-monorepo
```

### 2. Criando as variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
DB_URL=jdbc:postgresql://localhost:5432/taskflowdb
POSTGRES_DB=taskflowdb
DB_USERNAME=postgres
DB_PASSWORD=[sua senha]
SERVER_PORT=8081
JWT_SECRET=taskflow-secret-key-deve-ter-no-minimo-32-caracteres
JWT_EXPIRATION=86400000
ALLOWED_ORIGINS=http://localhost:3000
```

> ⚠️ **Atenção:** nunca commite o arquivo `.env` com credenciais reais. O `.gitignore` já está configurado para ignorá-lo.

### 3. Suba todos os serviços

```bash
docker compose up --build
```

Após o build, os serviços estarão disponíveis em:

| Serviço         | URL                                           |
| --------------- | --------------------------------------------- |
| 🎨 Frontend     | `http://localhost:3000`                       |
| ⚙️ Backend API  | `http://localhost:8080`                       |
| 📚 Swagger UI   | `http://localhost:8080/swagger-ui.html`       |
| 🗄️ PostgreSQL   | `localhost:5432`                              |

## Opção 2 — Execução Manual (Local)

### Backend (Spring Boot)

```bash
cd backend/api
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

O backend ficará disponível em `http://localhost:8080`.

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:3000`.

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
| `PATCH`  | `/tasks/{id}/status`       | Atualizar apenas o status de uma tarefa.      |
| `PATCH`  | `/tasks/{id}/priority`     | Atualizar apenas a prioridade de uma tarefa.  |
| `DELETE` | `/tasks/{id}`              | Remover uma tarefa.                           |

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
│       │   │   ├── java/
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
├── docker-compose.yml
├── LICENSE
├── package.json
└── README.md
```

---

## 🤝 Como Contribuir

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
5. **Abra um Pull Request** descrevendo o que mudou, como testar e inclua screenshots para mudanças visuais.

### 📝 Padrão de Commits

Este projeto segue o [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo     | Quando usar                                       |
| ----------- | ------------------------------------------------- |
| `feat:`     | Nova funcionalidade.                              |
| `fix:`      | Correção de bug.                                  |
| `docs:`     | Mudanças apenas na documentação.                  |
| `style:`    | Formatação, ponto-e-vírgula, espaços (sem código).|
| `refactor:` | Refatoração sem mudança de comportamento.         |
| `test:`     | Adição ou ajuste de testes.                       |
| `chore:`    | Tarefas de manutenção (build, deps, etc.).        |

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

</details>
