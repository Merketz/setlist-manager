import React, { useState } from 'react';
import { Trash2, Edit2, Save, X, Music, Key, Activity, Clock, MessageSquare, Star, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { deletarMusica, atualizarMusica, cadastrarAvaliacao, deletarAvaliacao, Musica, Avaliacao } from '../services/api';

interface SongListProps {
  musicas: Musica[];
  avaliacoes: Avaliacao[];
  onSongDeleted: () => void;
  onSongUpdated: () => void;
}

export const SongList: React.FC<SongListProps> = ({ musicas, avaliacoes, onSongDeleted, onSongUpdated }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingSong, setEditingSong] = useState<Musica | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedSongId, setExpandedSongId] = useState<string | null>(null);

  // Review Form States
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Vocal');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const roles = ['Vocal', 'Guitarra', 'Baixo', 'Bateria', 'Teclado', 'Produção / Outro'];

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
      onSongUpdated(); // Recarrega a lista
    } catch (err) {
      alert('Erro ao atualizar a música.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddReview = async (e: React.FormEvent, songId: string) => {
    e.preventDefault();
    if (!authorName.trim()) return;

    setSubmittingReview(true);
    try {
      const autorCompleto = `${authorName.trim()} (${authorRole})`;
      await cadastrarAvaliacao({
        musica_id: songId,
        autor: autorCompleto,
        nota: rating,
        comentario: comment.trim()
      });
      setComment('');
      onSongUpdated();
    } catch (err) {
      alert('Erro ao cadastrar feedback.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleRemoveReview = async (reviewId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este feedback?')) return;
    try {
      await deletarAvaliacao(reviewId);
      onSongUpdated();
    } catch (err) {
      alert('Erro ao remover feedback.');
    }
  };

  const getSongRatings = (songId?: string) => {
    if (!songId) return [];
    return avaliacoes.filter(av => av.musica_id === songId);
  };

  const getSongAverageRating = (songId?: string) => {
    const songRatings = getSongRatings(songId);
    if (songRatings.length === 0) return null;
    const sum = songRatings.reduce((acc, curr) => acc + curr.nota, 0);
    return (sum / songRatings.length).toFixed(1);
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
            const songRatings = getSongRatings(song.id);
            const average = getSongAverageRating(song.id);
            const isExpanded = expandedSongId === song.id;
            const isEditing = editingSong && editingSong.id === song.id;

            return (
              <div key={song.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div 
                  className="song-card" 
                  style={{ 
                    flexDirection: isEditing ? 'column' : 'row', 
                    alignItems: isEditing ? 'stretch' : 'center',
                    borderBottomLeftRadius: isExpanded && !isEditing ? '0' : '', 
                    borderBottomRightRadius: isExpanded && !isEditing ? '0' : '' 
                  }}
                >
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
                            {average && (
                              <>
                                <span>•</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#ffb800', fontWeight: 'bold' }}>
                                  <Star size={12} fill="#ffb800" stroke="#ffb800" /> {average} ({songRatings.length})
                                </span>
                              </>
                            )}
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
                      <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start', alignItems: 'center' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedSongId(null);
                            } else {
                              setExpandedSongId(song.id || null);
                              setRating(5);
                              setComment('');
                            }
                          }}
                          title="Feedbacks e Comentários"
                        >
                          <MessageSquare size={16} />
                          {songRatings.length > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{songRatings.length}</span>}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

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

                {isExpanded && !isEditing && (
                  <div className="song-comments-panel" style={{
                    marginTop: '-1px',
                    marginBottom: '0.75rem',
                    background: 'rgba(26, 30, 40, 0.4)',
                    border: '1px solid var(--border-color)',
                    borderTop: 'none',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    animation: 'slideDown 0.2s ease-out'
                  }}>
                    {/* List of comments */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Feedbacks da Banda
                      </h4>
                      {songRatings.length === 0 ? (
                        <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                          Nenhum comentário ainda. Seja o primeiro a avaliar esta música para o ensaio!
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                          {songRatings.map((av) => (
                            <div key={av.id} style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              padding: '0.75rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start'
                            }}>
                              <div style={{ flexGrow: 1, marginRight: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{av.autor}</span>
                                  <span style={{ display: 'inline-flex', gap: '0.05rem', color: '#ffb800' }}>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                      <Star
                                        key={idx}
                                        size={12}
                                        fill={idx < av.nota ? '#ffb800' : 'none'}
                                        stroke={idx < av.nota ? '#ffb800' : 'var(--text-secondary)'}
                                      />
                                    ))}
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    {av.created_at ? new Date(av.created_at).toLocaleDateString('pt-BR') : ''}
                                  </span>
                                </div>
                                {av.comentario && (
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', whiteSpace: 'pre-line' }}>
                                    {av.comentario}
                                  </p>
                                )}
                              </div>
                              <button
                                className="btn btn-danger"
                                style={{ padding: '0.25rem', minHeight: 'unset', background: 'transparent', border: 'none' }}
                                onClick={() => av.id && handleRemoveReview(av.id)}
                                title="Excluir feedback"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Form to submit review */}
                    <form onSubmit={(e) => song.id && handleAddReview(e, song.id)} style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Deixar seu Feedback
                      </h4>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '2 1 150px' }}>
                          <label htmlFor="autor-nome" style={{ fontSize: '0.7rem' }}>Seu Nome</label>
                          <input
                            id="autor-nome"
                            type="text"
                            required
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Ex: João"
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div style={{ flex: '1 1 120px' }}>
                          <label htmlFor="autor-funcao" style={{ fontSize: '0.7rem' }}>Função</label>
                          <select
                            id="autor-funcao"
                            value={authorRole}
                            onChange={(e) => setAuthorRole(e.target.value)}
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                          >
                            {roles.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '110px' }}>
                          <label style={{ fontSize: '0.7rem' }}>Nota</label>
                          <div style={{ display: 'flex', gap: '0.25rem', height: '34px', alignItems: 'center' }}>
                            {Array.from({ length: 5 }).map((_, idx) => {
                              const starValue = idx + 1;
                              return (
                                <Star
                                  key={idx}
                                  size={18}
                                  style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                                  fill={starValue <= rating ? '#ffb800' : 'none'}
                                  stroke={starValue <= rating ? '#ffb800' : 'var(--text-secondary)'}
                                  onClick={() => setRating(starValue)}
                                  className="rating-star-btn"
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="comentario-texto" style={{ fontSize: '0.7rem' }}>Comentário / Sugestões</label>
                        <textarea
                          id="comentario-texto"
                          rows={2}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Ex: Solo precisa de mais atenção, tom está ótimo..."
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', alignSelf: 'flex-end', fontSize: '0.85rem' }} disabled={submittingReview}>
                        <Send size={14} /> Enviar Feedback
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
