import React, { useEffect, useState } from 'react';
import { SongForm } from './components/SongForm';
import { SongList } from './components/SongList';
import { SetlistBuilder } from './components/SetlistBuilder';
import { SetlistList } from './components/SetlistList';
import { listarMusicas, listarSetlists, Musica, Setlist } from './services/api';
import { RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [musicasData, setlistsData] = await Promise.all([
        listarMusicas(),
        listarSetlists(),
      ]);
      setMusicas(musicasData);
      setSetlists(setlistsData);
    } catch (err: any) {
      setError('Falha ao conectar com o Supabase. Verifique suas credenciais no arquivo .env.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <span>🎸</span>
          <div>
            <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>Setlist Manager</span>
            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--accent-cyan)', letterSpacing: '0.2em', marginTop: '-4px' }}>PRO PANEL</span>
          </div>
        </div>
        
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ padding: '0.6rem 1rem' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sincronizar
        </button>
      </header>

      {error && (
        <div className="panel" style={{ borderColor: 'var(--accent-red)', marginBottom: '2rem', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ color: 'var(--accent-red)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Ops! Erro de Conexão
          </div>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      )}

      {loading && musicas.length === 0 && setlists.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
          <RefreshCw className="animate-spin" size={48} style={{ color: 'var(--accent-cyan)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dados da banda no Supabase...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Coluna Esquerda: Repertório e Cadastro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <SongForm onSongCreated={fetchData} />
            <SongList musicas={musicas} onSongDeleted={fetchData} />
          </div>

          {/* Coluna Direita: Construtor de Setlists e Listagem de Setlists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <SetlistBuilder musicas={musicas} onSetlistCreated={fetchData} />
            <SetlistList setlists={setlists} onSetlistDeleted={fetchData} />
          </div>
        </div>
      )}
    </div>
  );
};
