# ⚙️ SisGestão - Orquestração Operacional e Controle de SLAs

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **Acesse a aplicação em produção:** [https://a3-fpb.vercel.app/](https://a3-fpb.vercel.app/)

## 📖 Sobre o Projeto

O **SisGestão** é uma plataforma Full Stack desenvolvida para resolver um problema crítico em ambientes corporativos: a comunicação e o tempo de resposta entre diferentes setores durante a resolução de incidentes (como falhas de TI, manutenção de máquinas ou problemas na produção).

O sistema funciona através de **Workflows Dinâmicos (Passagem de Bastão)**. Um incidente é mapeado por etapas, e cada etapa possui uma Área Responsável e um SLA (Service Level Agreement) rigoroso. O incidente "viaja" automaticamente pelos painéis das equipes até sua conclusão, garantindo rastreabilidade e métricas de eficiência.

## ✨ Principais Funcionalidades

* **Workflows Intersetoriais:** Configuração de "Moldes de Incidentes", definindo a rota de resolução (Ex: *1. TI avalia (10 min) -> 2. Manutenção conserta (30 min) -> 3. Produção valida (5 min)*).
* **Painel Operacional em Tempo Real:** Cronômetros de SLA regressivos e filtragem inteligente (o operador só visualiza a ocorrência quando ela chega na etapa de responsabilidade do seu setor).
* **Controle de Acesso (RBAC):** Três níveis distintos de privilégios (Admin, Gerenciador e Operacional) protegendo as rotas e funções do sistema.
* **Gestão de Cadastros (CRUD):** Controle completo de Usuários, Áreas da empresa e Ativos Físicos/Digitais.
* **UX/UI Avançada:** Modo Claro/Escuro (Dark Mode) persistente, notificações em tempo real (Toast) e design responsivo.

## 🔒 Arquitetura e Segurança

Para garantir a integridade dos dados empresariais, o projeto conta com:
* **Criptografia Front-to-Back:** Utilização da *Web Crypto API (SHA-256)* para encriptar senhas antes mesmo de saírem do navegador.
* **Row Level Security (RLS):** Políticas de segurança restritas diretamente no banco de dados PostgreSQL (Supabase), impedindo inserções e leituras não autorizadas.
* **Validação de Formulários:** Integração de `React Hook Form` com `Zod` para validação rigorosa de tipagem e formato de dados.
* **Proteção de Rotas:** Redirecionamento seguro de rotas privadas utilizando React Router e Context API.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React (Context API, Hooks)
* Vite (Build tool configurado para otimização de chunks)
* Tailwind CSS v4 (Estilização utilitária e Dark Mode)
* React Router DOM (Navegação SPA)
* React Hook Form + Zod (Validação)
* Lucide React (Ícones)

**Backend / Infraestrutura:**
* Supabase (PostgreSQL, Autenticação, API RESTful)
* Vercel (CI/CD e Hospedagem em nuvem)

## 🚀 Como executar o projeto localmente

Pré-requisitos: Node.js e uma conta no Supabase.

```bash
# Clone este repositório
$ git clone [https://github.com/Jackson8119/A3FPB.git](https://github.com/Jackson8119/A3FPB.git)

# Acesse a pasta do projeto no terminal
$ cd A3FPB

# Instale as dependências
$ npm install

# Crie um arquivo .env na raiz do projeto com as suas credenciais do Supabase:
# VITE_SUPABASE_URL=sua_url_do_supabase_aqui
# VITE_SUPABASE_ANON_KEY=sua_anon_key_do_supabase_aqui
# VITE_ADMIN_EMAIL=seu_email_admin_aqui
# VITE_ADMIN_PASSWORD=sua_senha_admin_aqui

# Execute a aplicação em modo de desenvolvimento
$ npm run dev