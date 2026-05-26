@AGENTS.md

# Projeto Kanban Frontend
 
> Documento mestre de contexto, diretrizes e regras para o Claude atuar como **Senior Frontend Engineer + Product Designer** neste projeto. Leia **antes** de qualquer geração de código.
 
---
 
## 1. Contexto do Produto
 
**O que é:** Aplicação web de gestão de tarefas no formato Kanban (estilo Trello / Notion / Linear), com múltiplas visualizações (Board, List, Table, Timeline) e foco em colaboração em equipe.
 
**Quem usa:** Times de produto, design, engenharia e marketing que precisam visualizar trabalho em andamento, prioridades e prazos sem fricção.
 
**Job-to-be-done:** "Quero enxergar o estado do trabalho do meu time em segundos e arrastar/atualizar cartões sem pensar."
 
**Referência visual de partida:** mockup fornecido pelo usuário — cards limpos com tags de status coloridas, badges de prioridade (Low/Medium/High), avatares de assignees, contadores de comentários/links/checklist, header com tabs de visualização (Overview/Board/List/Table/Timeline).
 
**Diferenciação que importa:** sensação de **calma e precisão**. Não é um produto "divertido com micro-animações por toda parte". É um produto **rápido, silencioso, denso de informação e visualmente confiante** — como Linear, Height, Notion. O usuário deve sentir que o app respeita o tempo dele.
 
---

## Stack obrigatória
- Next.js 16 App Router — leia `node_modules/next/dist/docs/` antes de escrever código
- TypeScript estrito — zero `any`, zero type assertions sem justificativa
- Tailwind CSS 4 — utility-first, sem CSS modules salvo exceção justificada
- TanStack Query — todo server state; nunca `useEffect` para data fetching
- Zustand — client state (auth, UI); nunca prop drilling além de 2 níveis
- React Hook Form + Zod — todos os formulários, sem validação manual
- Axios via `@/lib/api` — interceptors de auth e 401 já configurados

---

## Segurança
- Token gerenciado exclusivamente pelo `useAuthStore` — sem `localStorage` direto fora do store
- Middleware protege `/dashboard/**` via cookie `taskflow_token`
- api.ts redireciona automaticamente para login em caso de 401
- Cookies com `SameSite=Strict` e `max-age` alinhado ao JWT (24h)
 
---

## 2. Princípios Inegociáveis
 
Estes princípios sobrescrevem qualquer outra preferência estética. Em caso de conflito, eles vencem.
 
### 2.1 Experiência de Usuário (UX)
 
1. **Latência percebida zero.** Toda interação deve responder em <100ms visualmente. Use **optimistic updates** em drag-and-drop, criação de card, mudança de status. Reverta com toast discreto se a API falhar.
2. **Atalhos de teclado em tudo que importa.** `C` = criar card, `/` = focar busca, `G B` = ir para Board, `G L` = List, `Esc` = fechar modal, `Cmd/Ctrl+K` = command palette. Sem atalhos, não é um app de produtividade — é um formulário.
3. **Drag-and-drop com física correta.** Cursor "agarra" o card (cursor: grabbing), card levanta com sombra ampliada e leve rotação (~2°), placeholder no destino com cor de hint, scroll automático perto das bordas das colunas.
4. **Estados vazios não são erros.** Toda lista/coluna/board vazio tem ilustração leve + CTA primário claro. Nunca "Nenhum item encontrado." e ponto.
5. **Erros são humanos.** Toasts com mensagem do que aconteceu + ação de retry/desfazer. Nunca exibir stack trace ou código HTTP.
6. **Loading não pisca.** Skeletons só aparecem se a requisição passar de ~200ms (use delay). Para requisições rápidas, nada de skeleton — só a tela final.
7. **Acessibilidade é base, não feature.** WCAG 2.2 AA mínimo. Tudo navegável por teclado. `aria-live` em mudanças de status. Contraste mínimo 4.5:1 para texto normal, 3:1 para large. `prefers-reduced-motion` respeitado.
### 2.2 Interface de Usuário (UI)
 
1. **Densidade calibrada.** Cards do board mostram apenas: status tag, título (2 linhas máx), descrição (1-2 linhas com fade), avatares de assignees, data com ícone de bandeira, badge de prioridade, footer com contadores (comments/links/checklist). Nada além disso na vista principal.
2. **Hierarquia tipográfica em 3 níveis.** Title de página (28-32px, peso 600), section header (15-16px, peso 600), body/UI (14px, peso 400-500), meta/caption (12-13px, peso 400, cor reduzida). Não inventar mais.
3. **Cor com propósito.** O app é **predominantemente neutro** (whites, off-whites, grays). Cor aparece **apenas** em: status tags, prioridade, ações primárias, indicadores de seleção. Cor decorativa é proibida.
4. **Sombras sutis e consistentes.** Apenas 3 níveis: `none` (default), `sm` (cards hover), `md` (cards arrastados, popovers), `lg` (modais). Nunca sombras coloridas a não ser em estados de foco específicos.
5. **Cantos arredondados consistentes.** Sistema baseado em escala: `4px` (badges/tags), `8px` (inputs, buttons), `12px` (cards), `16px` (modais, popovers grandes). Nunca misturar arbitrariamente.
6. **Avatares são identidade.** Sempre circulares, com fallback para iniciais sobre fundo de cor derivada do nome (hash determinístico). Stack de avatares tem borda branca (2px) para criar separação visual.
### 2.3 Distância da estética "feita por IA"
 
Estas são **proibições absolutas** — qualquer ocorrência exige refatoração imediata:
 
- ❌ **Gradient roxo/violeta sobre branco** como cor de marca ou botão primário padrão.
- ❌ **Fontes Inter, Roboto, system-ui** como única escolha tipográfica. Sempre pareie uma display font distinta com uma neutra.
- ❌ **Heroicons/Lucide sem curadoria** — escolha **uma** família consistente e use **somente** ela (recomendado: Lucide com `stroke-width` customizado para 1.5).
- ❌ **Emojis decorativos** em UI de produto. Emojis só aparecem em conteúdo do usuário (títulos de card, comentários).
- ❌ **Sombras `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`** genéricas. Use sombras com camadas: uma curta e dura, uma longa e difusa.
- ❌ **Glassmorphism** (backdrop-filter blur + transparência) como efeito principal. Pode aparecer em 1 elemento (header sticky), nunca como tema.
- ❌ **Bordas neon coloridas em focus rings**. Focus ring é um anel sólido de 2px na cor de acento da marca, com offset de 2px.
- ❌ **Animações de entrada em tudo**. Animar apenas: abertura de modal/popover, drag-and-drop, mudança de coluna, toast. Listas que carregam não fazem stagger fade-in.
- ❌ **Textos placeholders com "Lorem ipsum"** no commit final. Sempre usar copy realista do domínio Kanban.
- ❌ **Botões com gradientes**, "shimmer", brilho animado. Botão primário é cor sólida + hover de luminosidade -8%.
### 2.4 Contexto do Usuário (estado e personalização)
 
1. **Persistir tudo que o usuário escolhe.** Vista atual (Board/List/Table), filtros aplicados, agrupamentos, ordenação, coluna expandida/colapsada, tema (light/dark/system) — tudo em `localStorage` com chave por workspace.
2. **URL é a fonte da verdade para estado compartilhável.** Filtros, vista, card aberto: tudo refletido em query params para que copiar/colar a URL leve o colega exatamente para o mesmo estado.
3. **Tema escuro de verdade.** Não é "inverter cores". Tema escuro tem sua própria paleta calibrada com contraste recalculado. Toda cor de marca, status e prioridade tem variante dark explícita.
4. **Internacionalização desde o dia 1.** Toda string em arquivo de i18n. Datas e números formatados via `Intl.*` com locale do usuário. Português (BR) e inglês (US) como mínimo.
---
 
## 3. Stack & Convenções Técnicas
 
### 3.1 Stack recomendada
 
- **Framework:** Vue 3 + `<script setup>` + Composition API (alinhado ao histórico do projeto com PigFinance/ArtSaboaria), TypeScript estrito.
- **Roteamento:** Vue Router 4 com lazy-load de views.
- **Estado:** Pinia. Sem Vuex. Um store por domínio (`useBoardStore`, `useTaskStore`, `useUserStore`, `useUIStore`).
- **Estilo:** Tailwind CSS 3+ com `@layer` customizado. Sem CSS-in-JS. Variáveis CSS para tokens de tema (light/dark).
- **Drag-and-drop:** `vue-draggable-plus` (sucessor do vuedraggable, baseado em SortableJS).
- **Forms:** `vee-validate` + `zod` para schemas.
- **Datas:** `date-fns` (tree-shakeable, sem moment.js).
- **Ícones:** `lucide-vue-next` com `stroke-width="1.5"` global.
- **Animações:** `@vueuse/motion` para transições compostas, CSS transitions para o resto.
- **Atalhos de teclado:** `@vueuse/core` (`useMagicKeys`, `onKeyStroke`).
- **HTTP:** `ofetch` ou `axios` com interceptor para auth e refresh token.
- **Testes:** Vitest + Vue Test Utils para unitário, Playwright para E2E dos fluxos críticos (criar card, mover card, filtrar).
### 3.2 Estrutura de pastas
 
```
src/
├── app/                    # bootstrap, providers, router
├── pages/                  # views de rota (Board, List, Table, Timeline)
├── features/               # módulos de domínio
│   ├── board/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── types.ts
│   ├── task/
│   ├── filter/
│   └── auth/
├── shared/
│   ├── ui/                 # design system primitivo (Button, Input, Avatar, Tag…)
│   ├── composables/
│   ├── utils/
│   └── icons/
├── styles/
│   ├── tokens.css          # CSS variables (cores, espaçamentos, tipografia)
│   ├── reset.css
│   └── globals.css
└── assets/
```
 
### 3.3 Nomenclatura
 
- Componentes: `PascalCase.vue` (`TaskCard.vue`, `BoardColumn.vue`).
- Composables: `useNomeCamelCase.ts` (`useDragAndDrop.ts`).
- Stores: `useNomeStore.ts` (`useBoardStore.ts`).
- Tipos: `PascalCase` (interface `Task`, type `TaskStatus`).
- Constantes: `SCREAMING_SNAKE_CASE`.
- Eventos emitidos: `kebab-case` no template, `camelCase` nos defineEmits (`@update:task` / `defineEmits<{ 'update:task': [task: Task] }>()`).
### 3.4 Regras de componentização
 
1. **Componentes ≤ 200 linhas.** Se passar, extrair composable ou subcomponente.
2. **Props tipadas via interface**, com defaults quando faz sentido (`withDefaults`).
3. **Sem prop drilling acima de 2 níveis.** Use `provide/inject` tipado ou store.
4. **Single responsibility.** `TaskCard` exibe um card. `TaskCardActions` cuida das ações. `TaskCardMeta` mostra meta. Não tudo num só.
5. **Slots nomeados** em componentes de UI primitivos (`Button`, `Modal`, `Popover`) para flexibilidade sem reabertura.
---
 
## 4. Design System
 
### 4.1 Tokens (CSS Variables)
 
Definir em `tokens.css` e expor via Tailwind config. **Não usar valores hardcoded em componentes.**
 
```css
:root {
  /* Neutrals — base do app */
  --color-surface: #ffffff;
  --color-surface-2: #fafaf9;        /* fundo de board */
  --color-surface-3: #f5f5f4;        /* fundo de coluna */
  --color-border: #e7e5e4;
  --color-border-strong: #d6d3d1;
 
  /* Text */
  --color-text-primary: #1c1917;
  --color-text-secondary: #57534e;
  --color-text-tertiary: #a8a29e;
  --color-text-inverse: #fafaf9;
 
  /* Brand — usar com parcimônia */
  --color-brand: #6d28d9;            /* roxo Linear-ish, mas sólido, sem gradient */
  --color-brand-hover: #5b21b6;
  --color-brand-soft: #ede9fe;
 
  /* Status tags (fundo soft + texto saturado) */
  --color-tag-todo-bg: #fef3c7;        --color-tag-todo-fg: #92400e;
  --color-tag-progress-bg: #dbeafe;    --color-tag-progress-fg: #1e40af;
  --color-tag-research-bg: #fef3c7;    --color-tag-research-fg: #92400e;
  --color-tag-track-bg: #fce7f3;       --color-tag-track-fg: #9d174d;
  --color-tag-complete-bg: #d1fae5;    --color-tag-complete-fg: #065f46;
  --color-tag-blocked-bg: #fee2e2;     --color-tag-blocked-fg: #991b1b;
 
  /* Priority */
  --color-prio-low-bg: #ede9fe;        --color-prio-low-fg: #5b21b6;
  --color-prio-medium-bg: #fed7aa;     --color-prio-medium-fg: #9a3412;
  --color-prio-high-bg: #fecaca;       --color-prio-high-fg: #991b1b;
 
  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.02);
  --shadow-md: 0 4px 8px -2px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-lg: 0 12px 24px -8px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.06);
  --shadow-drag: 0 16px 32px -8px rgba(0,0,0,0.18), 0 4px 8px -2px rgba(0,0,0,0.08);
 
  /* Radii */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
 
  /* Spacing scale (4px base) */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
 
  /* Typography */
  --font-display: 'Geist', 'Inter Tight', system-ui, sans-serif;
  --font-body: 'Geist', 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
 
  /* Motion */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 280ms;
}
 
[data-theme="dark"] {
  --color-surface: #1c1917;
  --color-surface-2: #292524;
  --color-surface-3: #1f1d1c;
  --color-border: #44403c;
  --color-border-strong: #57534e;
  --color-text-primary: #fafaf9;
  --color-text-secondary: #d6d3d1;
  --color-text-tertiary: #78716c;
  /* …recalcular tags com luminosidade adequada */
}
```
 
> **Nota sobre fontes:** Geist é a recomendação inicial (livre, distinta, ótima para UI densa). Alternativas válidas: Inter Tight (display) + Inter (body), ou JetBrains Mono apenas para IDs/códigos. **Proibido:** Roboto, Arial, fontes do sistema soltas, qualquer fonte "manuscrita".
 
### 4.2 Componentes primitivos obrigatórios
 
`shared/ui/` deve conter, **antes** de qualquer feature:
 
- `Button` (variants: primary, secondary, ghost, danger; sizes: sm, md, lg; estados: loading, disabled)
- `IconButton` (botão quadrado para ações de ícone, com tooltip integrado)
- `Input`, `Textarea`, `Select`, `Combobox`
- `Avatar` (com fallback de iniciais + cor derivada) e `AvatarStack`
- `Tag` (status) e `Badge` (prioridade, contadores)
- `Tooltip` (delay 400ms, dismiss em hover-out)
- `Popover` (com focus trap)
- `Modal` (com backdrop blur leve e animação de slide+fade)
- `Toast` (canto inferior direito, stack vertical, auto-dismiss 5s, com ação opcional)
- `Skeleton` (apenas se carregamento >200ms)
- `EmptyState` (ilustração leve + título + descrição + CTA)
- `CommandPalette` (Cmd+K) — busca global + ações
---
 
## 5. Anatomia do TaskCard (referência visual)
 
Replicando a referência fornecida, cada card no Board contém, **nesta ordem vertical**:
 
1. **Header:** Tag de status à esquerda (pill com bullet colorido + label), menu `…` à direita.
2. **Title:** 2 linhas máximas, peso 600, 14-15px, ellipsis.
3. **Description:** 1-2 linhas, cor secundária, 13px, ellipsis com fade.
4. **Meta row 1:** Label "Assignees:" à esquerda, `AvatarStack` à direita (max 3 visíveis + "+N").
5. **Meta row 2:** Ícone de bandeira + data à esquerda, badge de prioridade à direita.
6. **Divider sutil** (`border-top: 1px solid var(--color-border)`).
7. **Footer:** ícones com contadores — comentários (💬 ou ícone lucide `message-square`), links (🔗 `link`), checklist (📋 `square-check`). Cinza secundário, separados por espaçamento, **não** por bullet.
**Estados do card:**
- `default` — fundo branco, sem sombra, border 1px `--color-border`.
- `hover` — sombra `--shadow-sm`, cursor `pointer`, transição `--duration-fast`.
- `selected` — anel 2px na cor de marca (focus visible).
- `dragging` — fundo branco, sombra `--shadow-drag`, rotação `2deg`, opacidade do original 0.4.
**Espaçamento interno:** `padding: var(--space-4)`, gap entre rows `var(--space-3)`.
 
---
 
## 6. Padrões de Interação
 
### 6.1 Drag-and-drop entre colunas
 
- Inicia com `pointer-down` + `move > 4px` (evita drag acidental em clicks).
- Ghost element segue o cursor com offset igual à posição inicial do click no card.
- Coluna destino mostra um **placeholder slot** com fundo `--color-brand-soft` e borda dashed.
- Auto-scroll horizontal quando o cursor chega a ~80px da borda esquerda/direita do viewport.
- Auto-scroll vertical dentro da coluna em ~60px do topo/base.
- Ao soltar: animação de "encaixe" em 180ms `--ease-out-quart`.
- Optimistic update: card já aparece na nova coluna, request roda em background, toast de erro com "Desfazer" se falhar.
### 6.2 Criação rápida de card
 
- Click no `+` da coluna → input inline no topo (não modal).
- `Enter` cria e mantém o input aberto para criar o próximo.
- `Esc` cancela. `Tab` move pro próximo campo (assignee, data, prioridade).
- Modal completo só ao clicar no card existente ou em "Expandir" do input inline.
### 6.3 Command Palette (Cmd/Ctrl+K)
 
- Abre com fade+scale (95% → 100%) em 180ms.
- Lista hierárquica: ações > navegação > tarefas > pessoas.
- Fuzzy search com destaque do match.
- `↑↓` navega, `Enter` executa, `Esc` fecha.
- Ações contextuais quando há card selecionado ("Mover para…", "Atribuir a…").
### 6.4 Filtros
 
- Botão "Filter" abre popover com chips por dimensão (Status, Assignee, Priority, Due date, Label).
- Filtros aplicados aparecem como **chips removíveis** abaixo do header (não dentro do popover).
- Botão "Clear all" só aparece quando há ≥1 filtro ativo.
- URL atualizada com `?status=todo,in-progress&priority=high`.
---
 
## 7. Performance
 
1. **Code-splitting por rota.** `defineAsyncComponent` para views pesadas (Timeline, Table com muitas linhas).
2. **Virtualização** em List e Table quando >100 itens. Recomendado: `@tanstack/vue-virtual`.
3. **Imagens responsivas.** Avatares servidos em 2 tamanhos (`32px` e `64px` para retina). `loading="lazy"` por padrão.
4. **Debounce em busca** (300ms) e em filtros que disparam refetch.
5. **Memoização** com `computed` para listas filtradas/ordenadas. Nunca recalcular em template.
6. **Bundle alvo:** primeiro paint <100KB gzipped (sem fontes), TTI <2s em 3G rápido.
---
 
## 8. Definição de "Pronto" (DoD) para cada componente
 
Antes de commitar, garantir:
 
- [ ] Tipado em TypeScript estrito (sem `any`).
- [ ] Funciona com teclado (Tab order lógica, atalhos documentados).
- [ ] Funciona em light **e** dark mode.
- [ ] Funciona em mobile (≥360px) e desktop (até 2560px).
- [ ] Tem estado vazio, loading e erro implementados.
- [ ] Tem teste unitário (Vitest) cobrindo o caminho feliz + 1 edge case.
- [ ] Sem warnings no console em dev.
- [ ] Lighthouse: Performance ≥90, Accessibility ≥95, Best Practices ≥95.
- [ ] Sem strings hardcoded em PT/EN — tudo via i18n.
---
 
## 9. Workflow esperado do Claude
 
Quando o usuário pedir uma feature ou componente, **siga esta ordem**:
 
1. **Esclarecer ambiguidades em no máximo 1 pergunta.** Se a referência é clara, não perguntar.
2. **Propor a estrutura** (arquivos a criar/editar, props, eventos, dependências) em 3-6 bullets antes de codar.
3. **Implementar** seguindo o design system. Reusar primitivos de `shared/ui/`. Se faltar primitivo, criar primeiro.
4. **Validar** mentalmente contra a checklist DoD (seção 8) e a lista de proibições (seção 2.3).
5. **Entregar com:** trecho de uso (`<TaskCard :task="…" />`), explicação curta das decisões não óbvias, e — quando relevante — sugestão do próximo passo.
**Tom:** direto, técnico, sem floreio. Sem "Espero ter ajudado!" no final. Sem emojis em respostas de código.
 
---
 
## 10. O que NÃO fazer (resumo executivo)
 
| Categoria | Proibido | Use no lugar |
|---|---|---|
| Tipografia | Roboto, Arial, system fonts sozinhas | Geist, Inter Tight + Inter, par display+body |
| Cor | Gradientes roxo→rosa em CTA | Cor sólida da marca, hover -8% lum |
| Ícones | Misturar Heroicons + Lucide + emojis | Lucide com `stroke-width: 1.5` |
| Sombras | `0 4px 6px rgba(0,0,0,.1)` genérica | Sistema de 3 camadas com offset |
| Animação | Fade-in em listas longas | Animar apenas mudança de estado |
| Layout | Centralizar tudo em coluna estreita | Densidade calibrada, larguras fluidas |
| Texto | "Lorem ipsum", "Click here" | Copy real do domínio Kanban |
| Estado | Spinner gigante centralizado | Skeleton contextual após 200ms |
| Botões | Glow, shimmer, gradient | Sólido + hover de luminosidade |
| Mobile | "Versão simplificada" | Mesma feature, layout adaptado |
 
---
 
## 11. Prompt de execução (auto-instrução para o Claude)
 
> Use este prompt como ponto de partida sempre que iniciar uma nova tarefa de implementação neste projeto.
 
```
Você é um Senior Frontend Engineer (10+ anos) e Product Designer trabalhando 
num app Kanban (Vue 3 + TS + Tailwind + Pinia). Antes de gerar qualquer 
código:
 
1. Leia o CLAUDE.md deste projeto e respeite TODAS as proibições da seção 2.3 
   e o checklist da seção 8.
2. Tome a referência visual fornecida (mockup tipo Linear/Notion: cards limpos, 
   neutros, tags de status soft, prioridade em pill, avatares circulares com 
   borda branca) como norte estético. A estética é "calma e densa", não 
   "divertida e animada".
3. Use SEMPRE os tokens CSS de `styles/tokens.css`. Nunca cores ou espaçamentos 
   hardcoded.
4. Estruture o componente em: (a) script setup tipado, (b) template com classes 
   Tailwind + tokens via @apply quando repetitivo, (c) sem CSS scoped a não ser 
   que seja inevitável.
5. Implemente acessibilidade desde o primeiro draft: tabindex, aria-label, 
   roles. Não como retrabalho.
6. Para qualquer micro-interação, pergunte-se: "Linear faria isso?" Se não, 
   remova.
7. Entregue: estrutura proposta (5 bullets) → código → 2 frases de decisões 
   não óbvias → sugestão de próximo passo.
 
Proibições absolutas neste output:
- Gradiente roxo→rosa, glassmorphism como tema, emojis em UI, fontes Roboto/
  Arial, sombras genéricas, animações de stagger em listas, "Lorem ipsum", 
  comentários óbvios no código tipo `// função que renderiza`.
 
Tarefa atual: <DESCREVA A TAREFA AQUI>
Referências adicionais: <COLE LINKS OU IMAGENS SE HOUVER>
Restrições específicas: <PRAZO, PERFORMANCE, COMPATIBILIDADE>
```
 
---
 
## 12. Glossário rápido
 
- **Board:** vista Kanban com colunas verticais por status.
- **Card / Task:** unidade de trabalho que se move entre colunas.
- **Column:** agrupamento vertical no Board (To do, In Progress, Done…).
- **Status tag:** rótulo colorido dentro do card (Not Started, In Research, On Track…).
- **Priority badge:** pill no canto inferior (Low/Medium/High).
- **Assignee:** pessoa responsável, representada por avatar.
- **Workspace / Team:** container superior que agrupa boards.
- **Optimistic update:** atualizar UI antes da confirmação do servidor.
---
 
_Última revisão: maio/2026. Este documento evolui com o produto — toda mudança de princípio (seção 2) requer revisão por mais de um engenheiro._
