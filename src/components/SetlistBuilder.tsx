import React, { useState } from 'react';
import { Loader2, ListPlus } from 'lucide-react';
import { criarSetlist, Musica } from '../services/api';

interface SetlistBuilderProps {
  musicas: Musica[];
  onSetlistCreated: () => void;
}

export const SetlistBuilder: React.FC<SetlistBuilderProps> = ({ musicas, onSetlistCreated }) => {
  const [nome, setNome] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleSong = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Por favor, dê um nome ao setlist.');
      return;
    }
    if (selectedIds.length === 0) {
      setError('Selecione pelo menos uma música para o setlist.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await criarSetlist(nome, selectedIds);
      setNome('');
      setSelectedIds([]);
      onSetlistCreated();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar setlist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span>⚡</span> Criar Novo Setlist
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="setlist-nome">Nome do Setlist / Show</label>
          <input
            id="setlist-nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Show Sesc Pompeia 2026"
            required
          />
        </div>

        <label>Selecione as músicas na ordem de execução</label>
        <div className="builder-musicas-selecao">
          {musicas.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
              Nenhuma música disponível.
            </div>
          ) : (
            musicas.map((song) => {
              const isSelected = song.id ? selectedIds.includes(song.id) : false;
              const selectedIndex = song.id ? selectedIds.indexOf(song.id) : -1;
              return (
                <div
                  key={song.id}
                  className="selecao-item"
                  onClick={() => song.id && handleToggleSong(song.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 242, 254, 0.05)' : '',
                    borderLeft: isSelected ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handle click on container instead
                    className="selecao-checkbox"
                  />
                  <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{song.nome}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{song.artista}</div>
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          background: 'var(--accent-cyan)',
                          color: 'var(--bg-primary)',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {selectedIndex + 1}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Criando...
            </>
          ) : (
            <>
              <ListPlus size={18} /> Gerar Setlist ({selectedIds.length} músicas)
            </>
          )}
        </button>
      </form>
    </div>
  );
};
