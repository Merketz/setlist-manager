import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { cadastrarMusica, Musica } from '../services/api';

interface SongFormProps {
  onSongCreated: () => void;
}

export const SongForm: React.FC<SongFormProps> = ({ onSongCreated }) => {
  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [genero, setGenero] = useState('');
  const [duracao, setDuracao] = useState('');
  const [tipo, setTipo] = useState('Cover');
  const [tom, setTom] = useState('');
  const [bpm, setBpm] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !artista) {
      setError('Nome da música e Artista são obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const novaMusica: Omit<Musica, 'id' | 'created_at'> = {
        nome,
        artista,
        genero: genero || 'Desconhecido',
        duracao: duracao || '-',
        tipo,
        tom: tom || '-',
        bpm: bpm || '-',
        status,
        observacoes,
      };

      await cadastrarMusica(novaMusica);
      
      // Reset form
      setNome('');
      setArtista('');
      setGenero('');
      setDuracao('');
      setTipo('Cover');
      setTom('');
      setBpm('');
      setStatus('Pendente');
      setObservacoes('');
      
      onSongCreated();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar música.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span>➕</span> Nova Música
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="form-row form-row-2">
          <div className="form-group">
            <label htmlFor="nome">Nome da Música *</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Fascination Street"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artista">Artista / Banda *</label>
            <input
              id="artista"
              type="text"
              value={artista}
              onChange={(e) => setArtista(e.target.value)}
              placeholder="Ex: The Cure"
              required
            />
          </div>
        </div>

        <div className="form-row form-row-3">
          <div className="form-group">
            <label htmlFor="tom">Tom</label>
            <input
              id="tom"
              type="text"
              value={tom}
              onChange={(e) => setTom(e.target.value)}
              placeholder="Ex: E, G#m, Drop D"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bpm">BPM</label>
            <input
              id="bpm"
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="Ex: 120"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duracao">Duração</label>
            <input
              id="duracao"
              type="text"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              placeholder="Ex: 5:16"
            />
          </div>
        </div>

        <div className="form-row form-row-3">
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Cover">Cover</option>
              <option value="Autoral">Autoral</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="genero">Gênero</label>
            <input
              id="genero"
              type="text"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              placeholder="Ex: Rock / Goth"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pendente">Pendente</option>
              <option value="Em ensaio">Em Ensaio</option>
              <option value="Pronta">Pronta</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: Detalhes de afinação, solos, estrutura ou backing vocals..."
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Salvando...
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Adicionar Música
            </>
          )}
        </button>
      </form>
    </div>
  );
};
