## Regras do projeto Collection (trabalho acadêmico)

- Este é um app Expo + React Native + TypeScript com Expo Router. As rotas ficam em `app/` (na raiz, NÃO em `src/app`). Não mova essa pasta.
- Todo o código de funcionalidades fica em `src/features/<nome-da-feature>/` com as subpastas `api`, `components`, `schemas`, `screens` e `types`. Código compartilhado fica em `src/shared/`.
- Arquivos em `app/` devem ser finos: só importam e exibem a tela vinda de `src/features`.
- Bibliotecas obrigatórias: react-hook-form, zod, @hookform/resolvers, axios e @tanstack/react-query. Usar todas, de verdade.
- O app consome uma API Laravel real. NUNCA inventar endpoints, campos ou funcionalidades que a API não tenha. Se faltar informação, perguntar antes.
- Não usar dados fictícios no lugar da API (exceto temporariamente, se eu pedir).
- Fazer UMA etapa por vez, só o que foi pedido. Não refatorar nem alterar o que já funciona.
- Explicar em linguagem simples, para iniciante, o que foi alterado e em quais arquivos.
- Tema visual: escuro, profissional e moderno. Estados de carregando, erro e lista vazia em todas as listas.
- Instalar pacotes do Expo com `npx expo install`.