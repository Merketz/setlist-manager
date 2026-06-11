import React, { useState } from 'react';
import { Trash2, Calendar, Radio } from 'lucide-react';
import { deletarSetlist, Setlist } from '../services/api';

interface SetlistListProps {
  setlists: Setlist[];
  onSetlistDeleted: () => void;
}

export const SetlistList: React.FC<SetlistListProps> = ({ setlists, onSetlistDeleted }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este setlist? As músicas associadas continuam no repertório.')) return;
    setDeletingId(id);
    try {
      await deletarSetlist(id);
      onSetlistDeleted();
    } catch (err) {
      alert('Erro ao excluir o setlist.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return dataStr;
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span>📋</span> Setlists Ativos
        </h3>
        <span className="setlist-badge-count">{setlists.length} setlists</span>
      </div>

      {setlists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>Nenhum setlist gerado ainda.</p>
          <p style={{ fontSize: '0.85rem' }}>Selecione músicas e salve no painel acima para vê-las aqui.</p>
        </div>
      ) : (
        <div className="setlists-container">
          {setlists.map((setlist) => (
            <div key={setlist.id} className="setlist-block">
              <div className="setlist-block-header">
                <div>
                  <h4 className="setlist-title">
                    <Radio size={16} /> {setlist.nome}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    <Calendar size={12} /> {formatarData(setlist.created_at)}
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  style={{ padding: '0.4rem', minHeight: 'unset' }}
                  onClick={() => handleDelete(setlist.id)}
                  disabled={deletingId === setlist.id}
                  title="Excluir setlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="setlist-songs-list">
                {setlist.musicas && setlist.musicas.length > 0 ? (
                  setlist.musicas.map((musica, index) => (
                    <div key={musica.id || index} className="setlist-song-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="setlist-song-number">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span>{musica.nome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>{musica.artista}</span>
                        <span>|</span>
                        <span style={{ color: 'var(--accent-cyan)' }}>{musica.tom}</span>
                        <span>|</span>
                        <span>{musica.duracao}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Sem músicas associadas.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
