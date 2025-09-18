# DOQR — Desafio Frontend

## Introdução

Olá! Eu sou **Isanio**, desenvolvedor **Frontend**. Este repositório apresenta a solução para o desafio da **DOQR**.

**Contato**

- **E‑mail:** _isaniovitot@gmail.com_
- **Telefone:** _(86) 99437-3471_

### Sobre o desafio

O projeto consiste em um **CRUD de funcionários** com as funcionalidades de **listar**, **criar**, **editar** e **excluir** registros. O foco foi entregar uma base sólida, com boa organização de código, experiência do usuário e facilidade de manutenção.

---

## Como rodar o projeto (Next.js)

### Pré‑requisitos

- **Node.js** 18+ (recomendado LTS)
- **npm**
- **Git**

### Passo a passo

1. **Clonar o repositório**

   ```bash
   git clone <URL-do-seu-repo>
   cd <pasta-do-repo>
   ```

2. **Instalar as dependências**

   ```bash
   # escolha um gestor de pacotes
   npm install
   # ou
   pnpm install
   # ou
   yarn
   ```

3. **Rodar em desenvolvimento**

   ```bash
   npm run dev
   ```

   Acesse em: http://localhost:3000

4. **Build de produção e preview**

   ```bash
   npm run build
   npm run start
   ```

5. **Testes E2E**

   ```bash
   # modo interativo
   npx cypress open

   # modo headless/CI
   npx cypress run
   ```

---

## Considerações

### 1) Design

Foram realizadas pequenas melhorias para **experiência do usuário**, como:

- Estados de **carregamento** e **erro** mais claros;
- **Responsividade**
- **Feedback visual** para ações (ex.: confirmação de exclusão);
- Ajustes sutis de **cores**, **tipografia** e **espaçamentos** para leitura mais confortável.

**Espaços para imagens:**

![Tela - Lista](/public/confirmDelete.png)
![Tela - Formulário](/public/feedback.png)
![Tela - Confirmação](/public/resp.png)

---

### 2) Uso de bibliotecas

Para o tamanho deste desafio, **não vi necessidade** de utilizar **Axios** ou **React Query**.  
Optei por `fetch`, que é **nativo** no Next.js/Browser e atende bem ao escopo atual.

> Em projetos maiores/complexos, o uso de **React Query** (cache, invalidações, revalidações) e **Axios** (interceptores, configs globais) é **recomendável** para escalabilidade e observabilidade.

---

### 3) Arquitetura modular

O projeto foi estruturado de forma **modular por domínio** para melhorar a organização e a manutenibilidade.  
Exemplo simplificado de estrutura:

```
src/
├─ app/                      # Rotas (App Router)
│  ├─ employees/             # Grupo de rotas do domínio
│  └─ layout.tsx
├─ modules/
│  └─ employees/             # Domínio "funcionários"
│     ├─ components/         # Componentes específicos do domínio
│     ├─ sections/           # Blocos (tabela, formulário, etc.)
│     ├─ actions/            # Server/Client actions para o domínio
│     ├─ types/              # DTOs, Models
│     └─ hooks/              # Hooks do domínio (opcional)
├─ components/ui/            # Componentes UI compartilhados (botões, tabelas...)
├─ lib/                      # Helpers, utils, configs
└─ styles/                   # Estilos globais
```

Essa abordagem facilita **evolução**, **testes** e **reuso** de componentes entre domínios.

---

### 4) CI/CD (pipeline + deploy)

Foi planejada a criação de uma **pipeline no GitHub Actions** para:

- Rodar **testes** a cada PR;
- Fazer **build** de produção;
- Publicar preview/deploy na **Vercel**.

---

## Tecnologias principais

- **Next.js** (App Router) + **React** + **TypeScript**
- **CSS/Design System** a critério **Shadcn**
- **fetch** API para comunicação com a(s) API(s)
- **Cypress**

---

## Licença

Este projeto é disponibilizado para fins de avaliação técnica.  
Direitos reservados ao autor. **DOQR** e demais marcas citadas pertencem aos seus respectivos donos.

---

**Obrigado pela avaliação!**  
Qualquer dúvida, fico à disposição nos contatos informados acima.
