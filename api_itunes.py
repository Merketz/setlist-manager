import requests

def buscar_dados_musica(nome_musica, artista=""):
    """
    Busca os dados de uma música na API pública do iTunes.
    """
    url = "https://itunes.apple.com/search"
    
    # Junta o nome da música e do artista para a busca ficar mais precisa
    termo_busca = f"{nome_musica} {artista}".strip()
    
    # Parâmetros que a API pede (queremos apenas 1 resultado, que seja música)
    params = {
        "term": termo_busca,
        "entity": "song",
        "limit": 1
    }
    
    try:
        # Fazendo a requisição HTTP GET
        resposta = requests.get(url, params=params)
        resposta.raise_for_status() # Verifica se deu algum erro (ex: 404, 500)
        
        dados = resposta.json()
        
        # Se encontrou alguma música
        if dados["resultCount"] > 0:
            musica = dados["results"][0]
            
            nome = musica.get("trackName", "Desconhecido")
            banda = musica.get("artistName", "Desconhecido")
            genero = musica.get("primaryGenreName", "Desconhecido")
            
            # A API devolve o tempo em milissegundos, vamos converter para MM:SS
            duracao_ms = musica.get("trackTimeMillis", 0)
            minutos = int((duracao_ms / (1000 * 60)) % 60)
            segundos = int((duracao_ms / 1000) % 60)
            duracao_formatada = f"{minutos}:{segundos:02d}"
            
            return {
                "nome": nome,
                "artista": banda,
                "genero": genero,
                "duracao": duracao_formatada
            }
        else:
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar com a API: {e}")
        return None

# --- Testando a função ---
if __name__ == "__main__":
    print("Buscando dados na API...\n")
    
    # Exemplo prático de busca
    resultado = buscar_dados_musica("My Own Summer", "Deftones")
    
    if resultado:
        print(f"🎵 Música: {resultado['nome']}")
        print(f"🎸 Banda: {resultado['artista']}")
        print(f"🎧 Gênero: {resultado['genero']}")
        print(f"⏱️ Duração: {resultado['duracao']}")
    else:
        print("Música não encontrada.")