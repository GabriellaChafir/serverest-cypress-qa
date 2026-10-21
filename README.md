# Desafio de Automação com Cypress — ServeRest

Testes automatizados com [Cypress](https://www.cypress.io/) e **TypeScript** para o **frontend** (E2E) e a **API** do ServeRest.

**Dashboard online com os resultados da última execução:** https://gabriellachafir.github.io/serverest-cypress-qa/dashboard/

- Frontend: https://front.serverest.dev/
- API (Swagger): https://serverest.dev/

## Cenários

| Camada   | Cenário                             | Arquivo                                              | Casos                                                                                                                              |
| -------- | ----------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | 1. Cadastro de usuário              | `cypress/e2e/frontend/user-registration.cy.ts`       | cadastro de admin; cadastro de não-admin; e-mail já utilizado                                                                      |
| Frontend | 2. Login                            | `cypress/e2e/frontend/login.cy.ts`                   | login como admin; login como não-admin; logout; sessão encerrada impede acesso; acesso direto sem autenticação; negativos em tabela |
| Frontend | 3. Cadastro de produto (admin)      | `cypress/e2e/frontend/product-registration.cy.ts`    | cadastro com sucesso e exibição na listagem; nome duplicado                                                                        |
| API      | 1. Gestão de usuários (`/usuarios`) | `cypress/e2e/api/users.cy.ts`                        | criar + contrato; atualizar; excluir; e-mail duplicado                                                                             |
| API      | 2. Autenticação (`/login`)          | `cypress/e2e/api/login.cy.ts`                        | token Bearer; negativos em tabela (senha inválida, e-mail inexistente, campos ausentes)                                            |
| API      | 3. Gestão de produtos (`/produtos`) | `cypress/e2e/api/products.cy.ts`                     | criar + contrato; listar; buscar por id; atualizar (campos alterados e inalterados); sem token e token malformado (401); não admin (403); nome duplicado |
| API      | 4. Carrinhos (`/carrinhos`)         | `cypress/e2e/api/carts.cy.ts`                        | criar; listar; buscar por id; checkout com redução de estoque dinâmica; cancelar                                                   |

## Como executar

Pré-requisito: Node.js 22+ (exigência do Cypress 16).

```bash
npm install
npm run cy:open     # modo interativo
npm test            # todos os testes (headless)
npm run test:api    # somente API
npm run test:front  # somente frontend
npm run test:evidence  # cenário de demonstração: falha de API proposital (fora do npm test)
npm run dash        # roda todos os testes e abre o dashboard com os resultados
npm run dashboard   # atualiza o dashboard com o último relatório e abre no navegador
npm run test:report # roda todos os testes e abre o relatório completo (mochawesome)
npm run report:open # abre o último relatório completo (mochawesome)
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
```

## Dashboard

O diretório `dashboard/` contém uma página HTML sem dependências de instalação, com a visão consolidada dos cenários automatizados: totais por camada (Frontend e Back End), cada spec com seus casos de teste (positivos e negativos), o resultado da última execução e as observações sobre a aplicação.

```bash
npm run dash        # roda os testes e abre o dashboard
npm run dashboard   # só abre, usando o último relatório gerado
```

**Exportar PDF:** o botão "Exportar PDF" da visão geral abre a impressão do navegador; escolha "Salvar como PDF". O arquivo reúne a visão geral, o resultado de cada spec e as observações. As requisições e respostas de cada teste ficam só na tela, não no PDF.

Como funciona: o relatório do mochawesome salva um JSON (`saveJson`), o script `scripts/build-dashboard-data.js` extrai dele o estado de cada teste e grava em `dashboard/data/` (ignorado pelo Git), e a página lê esses dados. Cada execução atualiza apenas os specs que rodou; os demais mantêm o último resultado. Sem execução registrada, os testes aparecem como "Sem execução". O catálogo de casos da página é mantido à mão em `dashboard/index.html`; ao criar ou renomear um teste, atualize-o também.

## Estrutura

```
.github/workflows/
└── cypress.yml               # CI: typecheck, lint, testes e publicação do dashboard e do relatório
dashboard/                    # dashboard HTML com os resultados da última execução
scripts/                      # abrir relatório/dashboard e gerar os dados do dashboard
cypress/
├── cypress.d.ts              # tipagem dos comandos customizados
├── e2e/
│   ├── api/                  # specs de API
│   │   └── scenarios/        # cenários negativos em tabela
│   └── frontend/             # specs E2E
│       └── scenarios/
├── evidence/                 # cenário de demonstração (falha proposital), fora do npm test
├── fixtures/
│   └── messages.json         # mensagens esperadas da API (fonte única)
└── support/
    ├── api/                  # services (um por recurso), httpClient e registro de evidências
    ├── asserts/              # assertivas reutilizáveis, separadas das pages
    ├── commands/             # comandos customizados (auth, dados, limpeza)
    ├── config/
    │   ├── environment.config.ts
    │   ├── interceptors/     # cy.intercept com alias
    │   ├── routes/           # rotas de API e de páginas
    │   └── selectors/        # seletores por tela
    ├── factories/            # massa de dados (faker)
    ├── hooks/                # hooks globais
    ├── pages/                # Page Objects
    ├── schemas/              # JSON Schemas (contrato)
    ├── types/                # tipos do domínio
    └── utils/                # validação de contrato e helpers de resposta
```

## Decisões de projeto

- **Page Object** com getters e métodos fluentes; seletores centralizados em `config/selectors`.
- **Asserts separados das pages**: os specs descrevem o comportamento e as verificações ficam em classes reutilizáveis.
- **Service Layer** na API, tipada: os specs não montam requisições.
- **Interceptors com alias**: o frontend é validado também pelo status HTTP das chamadas que ele faz, sem esperas fixas.
- **Cenários em tabela** para casos negativos (login, produtos e carrinhos), evitando duplicação e facilitando a ampliação da cobertura.
- **Mensagens em um fixture**: textos esperados da API ficam em `fixtures/messages.json`.
- **Massa dinâmica** com `@faker-js/faker`: nenhum teste depende de dados fixos, e a execução pode ser repetida ou paralelizada.
- **Setup e teardown via API**: o estado de cada teste é preparado e limpo por chamadas HTTP; a UI fica só com o que está sendo testado.
- **Sessão de login** reaproveitada com `cy.session`.
- **Teste de contrato** com `ajv` e JSON Schema.
- **Exceções do app não são silenciadas**: se o frontend lançar um erro inesperado, o teste falha.
- **Qualidade**: TypeScript estrito, ESLint (`typescript-eslint` e `eslint-plugin-cypress`) e Prettier. O CI roda `typecheck` e `lint` antes dos testes.

## Integração contínua

O workflow `.github/workflows/cypress.yml` roda a cada push e pull request para `main` ou `master`:

1. instala as dependências (Node 22);
2. `npm run typecheck` e `npm run lint`;
3. `npm test` (API e frontend);
4. anexa o relatório do mochawesome à execução, mesmo quando há falhas.

Nos pushes, o **dashboard** e o relatório completo também são publicados no GitHub Pages: a raiz do site abre o dashboard, e o link "Abrir relatório completo" leva ao relatório do mochawesome. Para isso, o repositório precisa ter em **Settings > Pages > Source** a opção **GitHub Actions**. Apenas o job de publicação recebe a permissão de escrita no Pages; o job que executa os testes tem só leitura.

## Cobertura

Em testes E2E e de API, a cobertura é medida por fluxos e endpoints, não por linhas de código:

- Usuários: `POST`, `GET /{id}`, `PUT`, `DELETE`
- Login: `POST /login` (sucesso, credencial inválida, e-mail inexistente, payload incompleto)
- Produtos: `POST` (admin, sem token, token malformado, não admin, duplicado), `GET` (listagem), `GET /{id}`, `PUT` (campos alterados e inalterados)
- Carrinhos: `POST`, `GET`, `GET /{id}`, `DELETE /concluir-compra`, `DELETE /cancelar-compra`
- Frontend: cadastro de usuário (admin e não-admin), login (admin, não-admin, logout, sessão, acesso não autenticado), cadastro de produto — com cenários positivos e negativos

## Evidências de falha

- **Frontend:** o Cypress tira um screenshot no momento da falha e o relatório do mochawesome o embute.
- **API:** cada chamada feita pelo `httpClient` é registrada em memória. Se o teste falha, o relatório recebe o bloco "API: requisições e respostas" com método, URL, corpo enviado, status e corpo devolvido. `password` e `authorization` saem mascarados.
- **Demonstração:** `cypress/evidence/api-failure-demo.cy.ts` falha de propósito para provar esse comportamento. Fica fora de `npm test` e roda com `npm run test:evidence`.

## Observações sobre a aplicação

Durante a automação, identificou-se a seguinte inconsistência no frontend:

- **Campo "Imagem" marcado como obrigatório (`*`) porém não validado**: o formulário de cadastro de produto exibe o campo de imagem com asterisco indicando obrigatoriedade, mas tanto o frontend quanto o backend aceitam o cadastro sem imagem. Não há validação client-side nem server-side aplicada. Esse tipo de inconsistência pode gerar confusão ao usuário e indica uma lacuna de validação.
