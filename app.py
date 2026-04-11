import json
import os
from typing import List, Dict
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()
ARQUIVO_SETLIST = 'setlist.json'

# --- FUNÇÕES DE DADOS ---

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

# --- INTERFACE E UTILITÁRIOS ---

def limpar_tela() -> None:
    os.system('cls' if os.name == 'nt' else 'clear')

def mostrar_tabela(titulo: str, lista_musicas: List[Dict]) -> None:
    table = Table(title=titulo, show_header=True, header_style="bold magenta")
    table.add_column("Nº", style="dim", width=4)
    table.add_column("Música", style="cyan", min_width=20)
    table.add_column("Tipo", justify="center")
    table.add_column("Tom", justify="center", style="yellow")
    table.add_column("BPM", justify="right")
    table.add_column("Status", style="green")
    
    for i, musica in enumerate(lista_musicas, 1):
        table.add_row(str(i), musica['nome'], musica['tipo'], musica['tom'], str(musica['bpm']), musica['status'])
    console.print(table)

def selecionar_indice(setlist: List[Dict], acao: str) -> int:
    """Auxiliar para obter um índice válido do usuário."""
    if not setlist:
        console.print("[yellow]O setlist está vazio.[/yellow]")
        return -1
    
    mostrar_tabela(f"Escolha a música para {acao}", setlist)
    try:
        escolha = int(input(f"\nDigite o Nº da música para {acao} (ou 0 para cancelar): "))
        if 0 < escolha <= len(setlist):
            return escolha - 1
    except ValueError:
        pass
    return -1

# --- CORE DAS NOVAS FUNÇÕES ---

def adicionar_musica(setlist: List[Dict]) -> None:
    limpar_tela()
    console.print("[bold cyan]--- ➕ ADICIONAR MÚSICA ---[/bold cyan]")
    nome = input("Nome: ").strip()
    if not nome: return
    
    tipo = input("Tipo (Autoral/Cover): ").strip().capitalize()
    tom = input("Tom: ").strip()
    bpm = input("BPM: ").strip()
    status = input("Status: ").strip()
    obs = input("Observações: ").strip()

    setlist.append({"nome": nome, "tipo": tipo, "tom": tom, "bpm": bpm, "status": status, "observacoes": obs})
    salvar_setlist(setlist)

def editar_musica(setlist: List[Dict]) -> None:
    limpar_tela()
    idx = selecionar_indice(setlist, "EDITAR")
    if idx == -1: return

    m = setlist[idx]
    console.print(f"\n[yellow]Editando: {m['nome']} (Deixe em branco para manter o valor atual)[/yellow]")
    
    m['nome'] = input(f"Nome [{m['nome']}]: ").strip() or m['nome']
    m['tipo'] = input(f"Tipo [{m['tipo']}]: ").strip() or m['tipo']
    m['tom'] = input(f"Tom [{m['tom']}]: ").strip() or m['tom']
    m['bpm'] = input(f"BPM [{m['bpm']}]: ").strip() or m['bpm']
    m['status'] = input(f"Status [{m['status']}]: ").strip() or m['status']
    m['observacoes'] = input(f"Obs [{m['observacoes']}]: ").strip() or m['observacoes']

    salvar_setlist(setlist)
    console.print("[green]✅ Alterações salvas![/green]")

def remover_musica(setlist: List[Dict]) -> None:
    limpar_tela()
    idx = selecionar_indice(setlist, "REMOVER")
    if idx == -1: return

    confirmar = input(f"Tem certeza que deseja remover '{setlist[idx]['nome']}'? (s/n): ").lower()
    if confirmar == 's':
        setlist.pop(idx)
        salvar_setlist(setlist)
        console.print("[red]❌ Música removida.[/red]")

def reordenar_setlist(setlist: List[Dict]) -> None:
    limpar_tela()
    idx_origem = selecionar_indice(setlist, "MOVER")
    if idx_origem == -1: return

    try:
        nova_pos = int(input(f"Mover '{setlist[idx_origem]['nome']}' para qual posição? (1 a {len(setlist)}): "))
        if 0 < nova_pos <= len(setlist):
            musica = setlist.pop(idx_origem)
            setlist.insert(nova_pos - 1, musica)
            salvar_setlist(setlist)
            console.print("[green]↕️ Ordem atualizada![/green]")
    except ValueError:
        console.print("[red]Posição inválida.[/red]")

# --- MENU PRINCIPAL ---

def main():
    setlist = carregar_setlist()
    while True:
        limpar_tela()
        console.print(Panel.fit("[bold magenta]🎸 SETLIST MANAGER PRO[/bold magenta]", border_style="cyan"))
        console.print("1. [cyan]Ver Repertório[/cyan] | 2. [green]Adicionar[/green] | 3. [yellow]Editar[/yellow]")
        console.print("4. [red]Remover[/red] | 5. [blue]Mover Posição[/blue] | 6. Sair")
        
        op = input("\nEscolha: ")
        if op == '1':
            limpar_tela()
            mostrar_tabela("🎵 Setlist Atual", setlist)
            input("\nENTER para voltar...")
        elif op == '2': adicionar_musica(setlist)
        elif op == '3': editar_musica(setlist)
        elif op == '4': remover_musica(setlist)
        elif op == '5': reordenar_setlist(setlist)
        elif op == '6': break

if __name__ == "__main__":
    main()