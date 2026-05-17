# 🎸 Setlist Manager Pro

![Badge de Build](https://img.shields.io/badge/build-passing-brightgreen)
![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.10+-yellow)

## 📌 O Problema
A organização de ensaios e a montagem de setlists para shows é uma dor real para bandas independentes. Frequentemente, informações cruciais como o tom ideal da música para o encaixe vocal, BPM para o baterista e o status de preparação (ex: faixas que precisam de revisão no estúdio) ficam perdidas em blocos de notas desorganizados ou mensagens de WhatsApp.

## 💡 A Solução
O **Setlist Manager Pro** é uma aplicação CLI (Command Line Interface) desenvolvida em Python que resolve esse problema centralizando o repertório da banda. Ele permite o cadastro, edição, remoção e ordenação de músicas de forma ágil, utilizando uma interface de terminal moderna e estilizada.

## ⚙️ Funcionalidades Principais
* **Integração com API Externa:** Busca automática de metadados da música (artista, gênero e duração) consumindo a iTunes Search API.
* **CRUD Completo:** Adicionar, visualizar, editar e remover músicas do repertório.
* **Ordenação Dinâmica:** Capacidade de reordenar o setlist para simular a ordem do show.
* **Filtro Inteligente:** Busca rápida de músicas por status (ex: "Pronta", "Em ensaio").
* **Validação de Dados:** Prevenção de erros de digitação em campos críticos como BPM e Tom (incluindo afinações específicas como Drop D).
* **Armazenamento Local:** Salvamento automático em arquivo `setlist.json` (banco de dados em memória/arquivo).

## 🛠️ Tecnologias Utilizadas
* **Linguagem:** Python 3.10+
* **Interface CLI:** Biblioteca `rich` (Tabelas e painéis estilizados)
* **Integração:** `requests` para consumo de API REST
* **Testes Automatizados:** `pytest` e `unittest` (Mock)
* **Análise Estática (Linting):** `flake8`
* **CI/CD:** GitHub Actions (Pipeline de validação contínua)

## 🐳 Como Executar a Aplicação (Deploy via Docker)
Como exigência de entrega e padronização, a aplicação está conteinerizada. Para rodar:

1. Certifique-se de ter o Docker instalado na máquina.
2. Na raiz do projeto, construa a imagem:
```bash
docker build -t setlist-manager .
```

3. Execute o container no modo interativo:

```bash
docker run -it setlist-manager
```
## 🚀 Como Instalar e Executar

1. Clone este repositório:
```bash
git clone [https://github.com/Merketz/setlist-manager.git](https://github.com/Merketz/setlist-manager.git)
cd setlist-manager
```
2. Instale as dependências declaradas:
```bash

pip install -r requirements.txt
```

3. Execute a aplicação:
```bash
python app.py
```
## 🧪 Como Rodar os Testes e o Linting

O projeto conta com validação estática e testes automatizados que garantem a integridade da lógica de carregamento e inserção de dados.

Para rodar a verificação de formatação (Lint):
```bash
flake8 app.py test_app.py
```
Para executar a suíte de testes:
```bash
pytest
```
## 📝 Exemplo de Estrutura de Dados

Os dados são armazenados localmente em um arquivo .json com a seguinte estrutura:
```JSON
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
    "observacoes": "Lembrar de repassar a linha de baixo; base vocal confortável entre E2 e F4."
  }
]
```

Desenvolvido por: Marco Antonio Rodrigues

Bootcamp: Engenharia de Software - Etapa 2
