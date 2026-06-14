# 🎸 Setlist Manager Pro

![Badge de Build](https://img.shields.io/badge/build-passing-brightgreen)
![Versão](https://img.shields.io/badge/version-1.1.0-blue)
![Python](https://img.shields.io/badge/python-3.10+-yellow)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## 📌 O Problema
A organização de ensaios e a montagem de setlists para shows é uma dor real para bandas independentes. Frequentemente, informações cruciais como o tom ideal da música para o encaixe vocal, BPM para o baterista, o status de preparação (ex: faixas que precisam de revisão no estúdio) e feedbacks dos integrantes ficam perdidas em blocos de notas desorganizados ou mensagens de WhatsApp.

## 💡 A Solução
O **Setlist Manager Pro** centraliza e organiza o repertório de bandas independentes. A solução agora conta com duas frentes integradas:
1. **Aplicação CLI (Command Line Interface):** Desenvolvida em Python com a biblioteca `rich`, ideal para quem quer rapidez no terminal e manipulação local via arquivos JSON.
2. **Interface Web GUI:** Desenvolvida em React, TypeScript e Vite, com banco de dados em tempo real utilizando o Supabase, permitindo gerenciamento colaborativo, visualização fluida e controle completo de setlists e feedbacks.

---

## ⚙️ Funcionalidades Principais

### 🐍 CLI (Python)
* **Integração com API Externa:** Busca automática de metadados da música (artista, gênero e duração) consumindo a iTunes Search API.
* **CRUD Completo:** Cadastro, visualização detalhada, edição e remoção de músicas.
* **Filtros e Busca:** Busca textual por nome/artista e filtragem inteligente pelo status (ex: "Pronta", "Em ensaio").
* **Ordenação Dinâmica:** Reorganização prática do setlist (comando de Mover).
* **Módulo de Feedbacks & Avaliações:** Permite que integrantes da banda deem notas de 1 a 5 estrelas e façam comentários específicos sobre cada música (útil para afinar arranjos).
* **Limpeza Completa:** Opção rápida para redefinir e apagar todo o repertório.
* **Armazenamento Local:** Banco de dados em memória persistido no arquivo `setlist.json`.

### ⚛️ Web App GUI (React + TypeScript + Supabase)
* **Visualização Moderna e Responsiva:** Dashboard elegante contendo estatísticas rápidas, barra de buscas e filtros integrados por status.
* **CRUD de Músicas & Setlists:** Gestão visual das músicas do repertório e montagem interativa de setlists nomeados.
* **Integração em Nuvem:** Dados persistidos de forma segura no Supabase (PostgreSQL), garantindo que todos os membros da banda visualizem a mesma informação em tempo real.
* **Feedback Colaborativo:** Visualização de médias de avaliações (estrelas) diretamente nos cards de músicas e lista de comentários detalhada de cada integrante.

---

## 🛠️ Tecnologias Utilizadas

### Backend / CLI
* **Linguagem:** Python 3.10+
* **Interface CLI:** Biblioteca `rich` (tabelas, painéis e cores no terminal)
* **Integração:** `requests` para consumo de API REST (iTunes)
* **Testes Automatizados:** `pytest` e `unittest` (Mock)

### Frontend / Web GUI
* **Framework:** React 18 & TypeScript
* **Build Tool:** Vite 5
* **Estilização:** CSS Vanilla Moderno (design minimalista e responsivo)
* **Icons:** `lucide-react`
* **Banco de Dados (BaaS):** Supabase (Postgres, RLS configurado)

---

## 🚀 Como Executar a Aplicação CLI (Python)

### Modo Local
1. Certifique-se de ter o Python 3.10+ instalado.
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Execute o script:
   ```bash
   python app.py
   ```

### Via Docker
1. Construa a imagem Docker:
   ```bash
   docker build -t setlist-manager .
   ```
2. Execute o container em modo interativo:
   ```bash
   docker run -it setlist-manager
   ```

---

## ⚛️ Como Executar a Interface Web (React)

### 1. Configuração do Banco de Dados no Supabase
1. Crie um projeto no [Supabase](https://supabase.com/).
2. No painel do projeto, abra o **SQL Editor** e execute as queries descritas no arquivo [schema.sql](file:///home/merketz/projetos/setlist-manager/supabase/schema.sql) para criar as tabelas de `musicas`, `setlists`, `setlist_musicas` e `avaliacoes`, bem como habilitar o RLS (Row Level Security).

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (ou edite o existente) com as suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### 3. Rodando o Frontend
1. Instale as dependências com npm:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse a URL indicada no terminal (geralmente `http://localhost:5173`).

---

## 🧪 Testes e Qualidade

Para garantir o funcionamento correto de toda a lógica da CLI (incluindo as novas regras de limpeza e feedbacks), execute o pytest na raiz do projeto:
```bash
pytest
```

---

## 📝 Estrutura do Arquivo Local JSON (CLI)
Quando usada de forma local, a aplicação CLI utiliza a seguinte estrutura no `setlist.json`:
```json
[
  {
    "nome": "Fascination Street",
    "artista": "The Cure",
    "genero": "Alternative",
    "duracao": "5:16",
    "tipo": "Cover",
    "tom": "E",
    "bpm": "120",
    "status": "Em ensaio",
    "observacoes": "Repassar linha de baixo.",
    "avaliacoes": [
      {
        "autor": "Marco (Baixista)",
        "nota": 5,
        "comentario": "Tom perfeito para a voz."
      }
    ]
  }
]
```

---

**Bootcamp:** Engenharia de Software - Etapa 3

