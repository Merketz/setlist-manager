import React, { useState } from 'react';
import { Trash2, Music, Key, Activity, Clock } from 'lucide-react';
import { deletarMusica, Musica } from '../services/api';

interface SongListProps {
  musicas: Musica[];
  onSongDeleted: () => void;
}

export const SongList: React.FC<SongListProps> = ({ musicas, onSongDeleted }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta música do repertório?')) return;
    setDeletingId(id);
    try {
      await deletarMusica(id);
      onSongDeleted();
    } catch (err) {
      alert('Erro ao excluir a música.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pronta':
        return 'badge badge-green';
      case 'em ensaio':
        return 'badge badge-yellow';
      default:
        return 'badge badge-cyan';
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span>🎵</span> Repertório Geral
        </h3>
        <span className="setlist-badge-count">{musicas.length} músicas</span>
      </div>

      {musicas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎸</div>
          <p>Nenhuma música cadastrada ainda.</p>
          <p style={{ fontSize: '0.85rem' }}>Utilize o formulário ao lado para começar seu repertório.</p>
        </div>
      ) : (
        <div className="songs-grid">
          {musicas.map((song) => (
            <div key={song.id} className="song-card">
              <div className="song-info">
                <div className="song-icon">
                  <Music size={18} />
                </div>
                <div className="song-details">
                  <div className="song-title">{song.nome}</div>
                  <div className="song-meta">
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{song.artista}</span>
                    <span>•</span>
                    <span className="badge badge-magenta">{song.tipo}</span>
                    <span>•</span>
                    <span className={getStatusBadgeClass(song.status)}>{song.status}</span>
                  </div>
                  {song.observacoes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                      Obs: {song.observacoes}
                    </div>
                  )}
                  <div className="song-meta" style={{ marginTop: '0.35rem', fontSize: '0.8rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Key size={12} /> {song.tom}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Activity size={12} /> {song.bpm} BPM
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} /> {song.duracao}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-danger"
                style={{ padding: '0.5rem' }}
                onClick={() => song.id && handleDelete(song.id)}
                disabled={deletingId === song.id}
                title="Excluir música"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
