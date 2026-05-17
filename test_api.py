import unittest
from unittest.mock import patch
# Importamos a função que você criou para integrar a API
from api_itunes import buscar_dados_musica

class TestiTunesAPI(unittest.TestCase):

    # O 'patch' intercepta a requisição de internet e finge que ela aconteceu
    @patch('api_itunes.requests.get')
    def test_buscar_dados_musica_com_sucesso(self, mock_get):
        """Testa se a função processa corretamente o JSON de retorno da API"""
        
        # Aqui nós desenhamos um JSON falso idêntico ao que o iTunes manda
        mock_resposta = mock_get.return_value
        mock_resposta.status_code = 200
        mock_resposta.json.return_value = {
            "resultCount": 1,
            "results": [
                {
                    "trackName": "My Own Summer",
                    "artistName": "Deftones",
                    "primaryGenreName": "Rock",
                    "trackTimeMillis": 215000  # 3 minutos e 35 segundos
                }
            ]
        }

        # Executa a função passando dados de teste
        resultado = buscar_dados_musica("My Own Summer", "Deftones")

        # Validações (Asserts): O teste só passa se tudo bater perfeito
        self.assertIsNotNone(resultado)
        self.assertEqual(resultado['nome'], "My Own Summer")
        self.assertEqual(resultado['artista'], "Deftones")
        self.assertEqual(resultado['genero'], "Rock")
        self.assertEqual(resultado['duracao'], "3:35")

    @patch('api_itunes.requests.get')
    def test_buscar_dados_musica_nao_encontrada(self, mock_get):
        """Testa o comportamento quando a API não encontra a música"""
        
        # Simulando uma resposta vazia da API
        mock_resposta = mock_get.return_value
        mock_resposta.status_code = 200
        mock_resposta.json.return_value = {
            "resultCount": 0,
            "results": []
        }

        resultado = buscar_dados_musica("MusicaQueNaoExiste123456")
        
        # Tem que retornar None (que foi o que programamos no fallback)
        self.assertIsNone(resultado)

if __name__ == '__main__':
    unittest.main()