import json
import os
from typing import List, Dict
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from api_itunes import buscar_dados_musica

console = Console()
ARQUIVO_SETLIST = 'setlist.json'


def carregar_setlist() -> List[Dict]:
    try:
        if os.path.exists(ARQUIVO_SETLIST):
            with open(ARQUIVO_SETLIST, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception:
        console.print("[red]Erro ao carregar arquivo.[/red]")
    return []


def salvar_setlist(setlist: List[Dict]) -> None:
    with open(ARQUIVO_SETLIST, 'w', encoding='utf-8') as f:
        json.dump(setlist, f, indent=4, ensure_ascii=False)


def limpar_tela() -> None:
    os.system('cls' if os.name == 'nt' else 'clear')


def mostrar_tabela(titulo: str, lista_musicas: List[Dict]) -> None:
    table = Table(title=titulo, show_header=True, header_style="bold magenta")
    table.add_column("Nº", style="dim", width=4)
    table.add_column("Música", style="cyan", min_width=20)
    table.add_column("Artista", style="blue")  # NOVA COLUNA
    table.add_column("Tipo", justify="center")
    table.add_column("Tom", justify="center", style="yellow")
    table.add_column("BPM", justify="right")
    table.add_column("Duração", style="magenta", justify="center")  # COLUNA
    table.add_column("Status", style="green")

    # Usamos .get() aqui para não quebrar caso seu setlist.json
    # tenha músicas antigas sem esses dados salvos.
    for i, musica in enumerate(lista_musicas, 1):
        table.add_row(
            str(i),
            musica.get('nome', 'N/A'),
            musica.get('artista', '-'),
            musica.get('tipo', '-'),
            musica.get('tom', '-'),
            str(musica.get('bpm', '-')),
            musica.get('duracao', '-'),
            musica.get('status', '-')
        )
    console.print(table)


def selecionar_indice(setlist: List[Dict], acao: str) -> int:
    if not setlist:
        console.print("[yellow]O setlist está vazio.[/yellow]")
        return -1

    mostrar_tabela(f"Escolha a música para {acao}", setlist)
    try:
        msg = f"\nNº da música para {acao} (ou 0 para cancelar): "
        escolha = int(input(msg))
        if 0 < escolha <= len(setlist):
            return escolha - 1
    except ValueError:
        pass
    return -1


def adicionar_musica(setlist: List[Dict]) -> None:
    limpar_tela()
    console.print("[bold cyan]--- ➕ ADICIONAR MÚSICA ---[/bold cyan]")
    nome = input("Nome da música: ").strip()
    if not nome:
        return

    msg_art = "Artista/Banda (opcional, para ajudar na busca): "
    artista_busca = input(msg_art).strip()

    msg_busca = "\n[italic dim]Buscando dados na API... ⏳[/italic dim]"
    console.print(msg_busca)
    dados_api = buscar_dados_musica(nome, artista_busca)

    if dados_api:
        msg_suc = (
            f"[green]✅ Encontrado: {dados_api['nome']} - "
            f"{dados_api['artista']} | {dados_api['genero']} | "
            f"{dados_api['duracao']}[/green]\n"
        )
        console.print(msg_suc)
        nome_final = dados_api['nome']
        artista_final = dados_api['artista']
        genero_final = dados_api['genero']
        duracao_final = dados_api['duracao']
    else:
        msg_falha = (
            "[yellow]❌ Não encontrada. "
            "Seguiremos com os dados manuais:[/yellow]\n"
        )
        console.print(msg_falha)
        nome_final = nome
        artista_final = artista_busca if artista_busca else "Desconhecido"
        genero_final = "Desconhecido"
        msg_dur = "Duração (ex: 3:45) ou enter para pular: "
        duracao_final = input(msg_dur).strip() or "-"

    tipo = input("Tipo (Autoral/Cover): ").strip().capitalize()
    tom = input("Tom: ").strip()
    bpm = input("BPM: ").strip()
    status = input("Status: ").strip()
    obs = input("Observações: ").strip()

    setlist.append({
        "nome": nome_final,
        "artista": artista_final,
        "genero": genero_final,
        "duracao": duracao_final,
        "tipo": tipo,
        "tom": tom,
        "bpm": bpm,
        "status": status,
        "observacoes": obs
    })
    salvar_setlist(setlist)
    console.print("[green]✅ Música adicionada com sucesso![/green]")
    input("\nPressione ENTER para continuar...")


def editar_musica(setlist: List[Dict]) -> None:
    limpar_tela()
    idx = selecionar_indice(setlist, "EDITAR")
    if idx == -1:
        return

    m = setlist[idx]
    console.print(f"\n[yellow]Editando: {m.get('nome', '')}[/yellow]")

    n_at = m.get('nome', '')
    m['nome'] = input(f"Nome [{n_at}]: ").strip() or n_at

    art_at = m.get('artista', '')
    m['artista'] = input(f"Artista [{art_at}]: ").strip() or art_at

    tipo_at = m.get('tipo', '')
    m['tipo'] = input(f"Tipo [{tipo_at}]: ").strip() or tipo_at

    tom_at = m.get('tom', '')
    m['tom'] = input(f"Tom [{tom_at}]: ").strip() or tom_at

    bpm_at = m.get('bpm', '')
    m['bpm'] = input(f"BPM [{bpm_at}]: ").strip() or bpm_at

    dur_at = m.get('duracao', '')
    m['duracao'] = input(f"Duração [{dur_at}]: ").strip() or dur_at

    stat_at = m.get('status', '')
    m['status'] = input(f"Status [{stat_at}]: ").strip() or stat_at

    obs_at = m.get('observacoes', '')
    obs = input(f"Obs [{obs_at}]: ").strip()
    m['observacoes'] = obs or obs_at

    salvar_setlist(setlist)
    console.print("[green]✅ Alterações salvas![/green]")
    input("\nPressione ENTER para continuar...")


def remover_musica(setlist: List[Dict]) -> None:
    limpar_tela()
    idx = selecionar_indice(setlist, "REMOVER")
    if idx == -1:
        return

    nome_mus = setlist[idx].get('nome', 'Desconhecida')
    confirmar = input(f"Remover '{nome_mus}'? (s/n): ").lower()
    if confirmar == 's':
        setlist.pop(idx)
        salvar_setlist(setlist)
        console.print("[red]❌ Música removida.[/red]")
        input("\nPressione ENTER para continuar...")


def reordenar_setlist(setlist: List[Dict]) -> None:
    limpar_tela()
    idx_origem = selecionar_indice(setlist, "MOVER")
    if idx_origem == -1:
        return

    nome_mus = setlist[idx_origem].get('nome', 'Desconhecida')
    try:
        msg = f"Mover '{nome_mus}' para qual posição? (1 a {len(setlist)}): "
        nova_pos = int(input(msg))
        if 0 < nova_pos <= len(setlist):
            musica = setlist.pop(idx_origem)
            setlist.insert(nova_pos - 1, musica)
            salvar_setlist(setlist)
            console.print("[green]↕️ Ordem atualizada![/green]")
            input("\nPressione ENTER para continuar...")
    except ValueError:
        console.print("[red]Posição inválida.[/red]")
        input("\nPressione ENTER para continuar...")


def main():
    setlist = carregar_setlist()
    while True:
        limpar_tela()
        titulo = "[bold magenta]🎸 SETLIST MANAGER PRO[/bold magenta]"
        console.print(Panel.fit(titulo, border_style="cyan"))

        console.print(
            "1. [cyan]Ver Repertório[/cyan] | "
            "2. [green]Adicionar[/green]"
        )
        console.print(
            "3. [yellow]Editar[/yellow] | "
            "4. [red]Remover[/red]"
        )
        console.print("5. [blue]Mover[/blue] | 6. Sair")

        op = input("\nEscolha: ")
        if op == '1':
            limpar_tela()
            mostrar_tabela("🎵 Setlist Atual", setlist)
            input("\nENTER para voltar...")
        elif op == '2':
            adicionar_musica(setlist)
        elif op == '3':
            editar_musica(setlist)
        elif op == '4':
            remover_musica(setlist)
        elif op == '5':
            reordenar_setlist(setlist)
        elif op == '6':
            break


if __name__ == "__main__":
    main()
