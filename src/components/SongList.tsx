import React, { useState } from 'react';
import { Trash2, Edit2, Save, X, Music, Key, Activity, Clock } from 'lucide-react';
import { deletarMusica, atualizarMusica, Musica } from '../services/api';

interface SongListProps {
  musicas: Musica[];
  onSongDeleted: () => void;
}

export const SongList: React.FC<SongListProps> = ({ musicas, onSongDeleted }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingSong, setEditingSong] = useState<Musica | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleEditClick = (song: Musica) => {
    setEditingSong({ ...song });
  };

  const handleCancelEdit = () => {
    setEditingSong(null);
  };

  const handleSaveEdit = async () => {
    if (!editingSong || !editingSong.id) return;
    if (!editingSong.nome.trim() || !editingSong.artista.trim()) {
      alert('Nome da música e Artista são obrigatórios.');
      return;
    }

    setUpdatingId(editingSong.id);
    try {
      const { id, created_at, ...camposParaAtualizar } = editingSong;
      await atualizarMusica(id, camposParaAtualizar);
      setEditingSong(null);
      onSongDeleted(); // Recarrega a lista
    } catch (err) {
      alert('Erro ao atualizar a música.');
    } finally {
      setUpdatingId(null);
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
          {musicas.map((song) => {
            const isEditing = editingSong && editingSong.id === song.id;

            return (
              <div key={song.id} className="song-card" style={{ flexDirection: isEditing ? 'column' : 'row', alignItems: isEditing ? 'stretch' : 'center' }}>
                {isEditing && editingSong ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                    {/* Nome e Artista */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>Nome da Música</label>
                        <input
                          type="text"
                          value={editingSong.nome}
                          onChange={(e) => setEditingSong({ ...editingSong, nome: e.target.value })}
                          placeholder="Ex: Fascination Street"
                          style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>Artista / Banda</label>
                        <input
                          type="text"
                          value={editingSong.artista}
                          onChange={(e) => setEditingSong({ ...editingSong, artista: e.target.value })}
                          placeholder="Ex: The Cure"
                          style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    {/* Tom, BPM, Duração, Tipo e Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>Tom</label>
                        <input
                          type="text"
                          value={editingSong.tom}
                          onChange={(e) => setEditingSong({ ...editingSong, tom: e.target.value })}
                          placeholder="Ex: E"
                          style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>BPM</label>
                        <input
                          type="text"
                          value={editingSong.bpm}
                          onChange={(e) => setEditingSong({ ...editingSong, bpm: e.target.value })}
                          placeholder="Ex: 120"
                          style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>Duração</label>
                        <input
                          type="text"
                          value={editingSong.duracao}
                          onChange={(e) => setEditingSong({ ...editingSong, duracao: e.target.value })}
                          placeholder="Ex: 5:16"
                          style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>Tipo</label>
                        <select
                          value={editingSong.tipo}
                          onChange={(e) => setEditingSong({ ...editingSong, tipo: e.target.value })}
                          style={{ padding: '0.5rem', fontSize: '0.9rem', height: 'auto' }}
                        >
                          <option value="Cover">Cover</option>
                          <option value="Autoral">Autoral</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.7rem' }}>Status</label>
                        <select
                          value={editingSong.status}
                          onChange={(e) => setEditingSong({ ...editingSong, status: e.target.value })}
                          style={{ padding: '0.5rem', fontSize: '0.9rem', height: 'auto' }}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em ensaio">Em ensaio</option>
                          <option value="Pronta">Pronta</option>
                        </select>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.7rem' }}>Observações</label>
                      <textarea
                        value={editingSong.observacoes || ''}
                        onChange={(e) => setEditingSong({ ...editingSong, observacoes: e.target.value })}
                        placeholder="Ex: Detalhes de afinação, solos..."
                        rows={1}
                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Ações */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={handleCancelEdit}
                        disabled={updatingId === song.id}
                      >
                        <X size={14} /> Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={handleSaveEdit}
                        disabled={updatingId === song.id}
                      >
                        <Save size={14} /> {updatingId === song.id ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                    <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleEditClick(song)}
                        title="Editar música"
                      >
                        <Edit2 size={16} />
                      </button>
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
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

