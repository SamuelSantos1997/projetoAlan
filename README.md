# FitPanel - Painel de Academia

Sistema de gerenciamento para academia com controle de frequência, treinos e perfil de usuários.

## Estrutura do Projeto

```
projetoAlan/
├── index.html          # Página principal (redireciona para frequência)
├── assets/
│   ├── css/            # Estilos CSS
│   └── js/             # Scripts JavaScript
├── controllers/        # Controladores da aplicação
├── models/             # Modelos de dados
└── views/
    ├── cadastro/       # Tela de cadastro
    ├── home/           # Página inicial e frequência
    ├── login/          # Tela de login
    ├── partials/       # Componentes reutilizáveis
    ├── perfil/         # Perfil do usuário
    ├── pessoal/        # Área pessoal
    ├── premium/        # Recursos premium
    └── treinos/        # Gestão de treinos
```

## Como Rodar o Projeto

### Pré-requisitos

- Python 3.x instalado (para o servidor HTTP simples)

### Opção 1: Python HTTP Server

```bash
cd /home/kairo/projects/Fullstack/projetoAlan
python3 -m http.server 8001
```

Acesse: **http://localhost:8001**

### Opção 2: Live Server (VSCode)

1. Instale a extensão "Live Server" no VSCode
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

### Opção 3: PHP Built-in Server

```bash
cd /home/kairo/projects/Fullstack/projetoAlan
php -S localhost:8001
```

Acesse: **http://localhost:8001**

## Páginas Disponíveis

| Página | URL |
|--------|-----|
| Home/Frequência | `/views/home/frequencia.html` |
| Login | `/views/login/` |
| Cadastro | `/views/cadastro/` |
| Perfil | `/views/perfil/` |
| Treinos | `/views/treinos/` |

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font: Inter (Google Fonts)