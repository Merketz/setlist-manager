import os
import app


def test_carregar_setlist_vazio():
    app.ARQUIVO_SETLIST = 'arquivo_fantasma.json'
    if os.path.exists(app.ARQUIVO_SETLIST):
        os.remove(app.ARQUIVO_SETLIST)
    assert app.carregar_setlist() == []


def test_salvar_e_carregar():
    app.ARQUIVO_SETLIST = 'setlist_teste.json'
    musica_teste = [{
        "nome": "Fascination Street",
        "tipo": "Cover",
        "tom": "E",
        "bpm": "120",
        "status": "Pronta",
        "observacoes": "Repassar baixo"
    }]

    app.salvar_setlist(musica_teste)
    carregado = app.carregar_setlist()

    assert len(carregado) == 1
    assert carregado[0]["nome"] == "Fascination Street"

    if os.path.exists(app.ARQUIVO_SETLIST):
        os.remove(app.ARQUIVO_SETLIST)


def test_estrutura_nova_musica():
    setlist_virtual = []
    nova_musica = {
        "nome": "Música Autoral",
        "tipo": "Autoral",
        "tom": "Drop D",
        "bpm": "110",
        "status": "Em ensaio",
        "observacoes": ""
    }
    setlist_virtual.append(nova_musica)
    assert len(setlist_virtual) == 1
    assert "tom" in setlist_virtual[0]


def test_avaliacoes_e_media():
    app.ARQUIVO_SETLIST = 'setlist_avaliacoes_teste.json'
    musicas_teste = [{
        "nome": "Fascination Street",
        "tipo": "Cover",
        "tom": "E",
        "bpm": "120",
        "status": "Pronta",
        "observacoes": "Repassar baixo",
        "avaliacoes": [
            {"autor": "João (Bateria)", "nota": 5, "comentario": "Perf!"},
            {"autor": "Maria (Vocal)", "nota": 3, "comentario": "Alto"}
        ]
    }]

    app.salvar_setlist(musicas_teste)
    carregado = app.carregar_setlist()

    assert len(carregado) == 1
    song = carregado[0]
    assert "avaliacoes" in song
    assert len(song["avaliacoes"]) == 2

    total_notas = sum(av["nota"] for av in song["avaliacoes"])
    media = total_notas / len(song["avaliacoes"])
    assert media == 4.0

    if os.path.exists(app.ARQUIVO_SETLIST):
        os.remove(app.ARQUIVO_SETLIST)


def test_limpar_repertorio_confirmado(monkeypatch):
    app.ARQUIVO_SETLIST = 'setlist_limpar_teste.json'
    setlist_teste = [{"nome": "Musica 1"}, {"nome": "Musica 2"}]
    app.salvar_setlist(setlist_teste)

    # Mock input to confirm
    monkeypatch.setattr('builtins.input', lambda _: 's')

    app.limpar_repertorio(setlist_teste)

    assert setlist_teste == []
    assert app.carregar_setlist() == []

    if os.path.exists(app.ARQUIVO_SETLIST):
        os.remove(app.ARQUIVO_SETLIST)


def test_limpar_repertorio_cancelado(monkeypatch):
    app.ARQUIVO_SETLIST = 'setlist_limpar_teste.json'
    setlist_teste = [{"nome": "Musica 1"}, {"nome": "Musica 2"}]
    app.salvar_setlist(setlist_teste)

    # Mock input to cancel
    monkeypatch.setattr('builtins.input', lambda _: 'n')

    app.limpar_repertorio(setlist_teste)

    assert len(setlist_teste) == 2
    assert len(app.carregar_setlist()) == 2

    if os.path.exists(app.ARQUIVO_SETLIST):
        os.remove(app.ARQUIVO_SETLIST)
