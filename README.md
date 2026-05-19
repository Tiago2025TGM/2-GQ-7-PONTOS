# 📚 BookShelf — MINF-0005

Aplicativo mobile de gerenciamento de livros desenvolvido com React Native + Expo.

## Integrantes da Equipe

| Nome | GitHub |
|------|--------|
| Tiago | [@Tiago2025TGM](https://github.com/Tiago2025TGM) |

## Sobre o Projeto

**BookShelf** é um acervo pessoal de livros que permite ao usuário:
- Cadastrar, visualizar, editar e excluir livros (CRUD completo)
- Organizar livros por gênero literário
- Acompanhar o progresso de leitura (quero ler, lendo, lido)
- Avaliar livros com estrelas e adicionar notas pessoais
- Buscar livros por título ou autor
- Compartilhar o acervo publicamente

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native + Expo SDK 54 |
| Navegação | Expo Router v6 |
| Estado Global | Zustand v5 |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| Estilização | NativeWind v4 (Tailwind CSS) |
| Formulários | react-hook-form + zod |

## Como Executar

### Pré-requisitos
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Conta no [Supabase](https://supabase.com) (gratuita)

### Configuração

1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone <url>
   cd MINF-0005
   npm install
   ```

2. **Configure o Supabase:**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Execute o SQL em `supabase/schema.sql` no SQL Editor do Supabase
   - Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto

   ```bash
   cp .env.example .env
   ```

3. **Inicie o app:**
   ```bash
   npx expo start
   ```
   Escaneie o QR Code com o app **Expo Go** no seu celular.

## Estrutura do Projeto

```
MINF-0005/
├── app/                 # Rotas (Expo Router)
│   ├── (auth)/          # Login e cadastro
│   ├── (tabs)/          # Telas principais (Home, Busca, Novo, Perfil, Sobre)
│   ├── book/            # Detalhe e edição de livro
│   └── team/            # Equipe
├── components/          # Componentes reutilizáveis
├── stores/              # Zustand (estado global)
├── services/            # Integração com Supabase
├── hooks/               # Custom hooks
├── types/               # Tipos TypeScript
└── constants/           # Constantes (cores, dados estáticos)
```

## Requisitos Atendidos

- [x] Expo Router (navegação por arquivo)
- [x] Zustand (estado global)
- [x] Tela Home, Sobre e membro da equipe
- [x] Interações (botões, inputs, checkboxes, seleção de status)
- [x] CRUD completo de `books` + exibição de `genres` (relacionamento via `book_genres` e `reading_progress`)
- [x] Autenticação com login, logout e cadastro integrados ao Supabase
- [x] Estilização com NativeWind (Tailwind CSS)

## Link do App

> Publicado no Expo Go: _(adicionar após publicação com `eas update`)_

## Vídeo Demonstrativo

> YouTube: _(adicionar após gravação)_
