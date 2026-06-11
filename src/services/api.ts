import { supabase } from '../lib/supabase';

export interface Musica {
  id?: string;
  nome: string;
  artista: string;
  genero?: string;
  duracao?: string;
  tipo?: string;
  tom?: string;
  bpm?: string;
  status?: string;
  observacoes?: string;
  created_at?: string;
}

export interface Setlist {
  id: string;
  nome: string;
  created_at: string;
  musicas?: Musica[];
}

// ==========================================
// CRUD DE MÚSICAS
// ==========================================

export async function listarMusicas(): Promise<Musica[]> {
  const { data, error } = await supabase
    .from('musicas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar músicas:', error);
    throw error;
  }
  return data || [];
}

export async function cadastrarMusica(musica: Omit<Musica, 'id' | 'created_at'>): Promise<Musica> {
  const { data, error } = await supabase
    .from('musicas')
    .insert([musica])
    .select()
    .single();

  if (error) {
    console.error('Erro ao cadastrar música:', error);
    throw error;
  }
  return data;
}

export async function deletarMusica(id: string): Promise<void> {
  const { error } = await supabase
    .from('musicas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar música:', error);
    throw error;
  }
}

// ==========================================
// CRUD DE SETLISTS
// ==========================================

export async function listarSetlists(): Promise<Setlist[]> {
  // Busca os setlists
  const { data: setlists, error: errSetlists } = await supabase
    .from('setlists')
    .select('*')
    .order('created_at', { ascending: false });

  if (errSetlists) {
    console.error('Erro ao listar setlists:', errSetlists);
    throw errSetlists;
  }

  if (!setlists) return [];

  // Busca as músicas de cada setlist
  const setlistsComMusicas: Setlist[] = [];
  
  for (const setlist of setlists) {
    const { data: junctionData, error: errJunction } = await supabase
      .from('setlist_musicas')
      .select('ordem, musicas (*)')
      .eq('setlist_id', setlist.id)
      .order('ordem', { ascending: true });

    if (errJunction) {
      console.error(`Erro ao obter músicas do setlist ${setlist.id}:`, errJunction);
      continue;
    }

    const musicas = junctionData
      ? junctionData.map((item: any) => item.musicas).filter(Boolean)
      : [];

    setlistsComMusicas.push({
      ...setlist,
      musicas
    });
  }

  return setlistsComMusicas;
}

export async function criarSetlist(nome: string, musicasIds: string[]): Promise<Setlist> {
  // 1. Criar o cabeçalho do setlist
  const { data: setlist, error: errSetlist } = await supabase
    .from('setlists')
    .insert([{ nome }])
    .select()
    .single();

  if (errSetlist || !setlist) {
    console.error('Erro ao criar setlist:', errSetlist);
    throw errSetlist || new Error('Erro ao criar setlist');
  }

  // 2. Criar os registros de junção ordenados
  if (musicasIds.length > 0) {
    const records = musicasIds.map((musicaId, index) => ({
      setlist_id: setlist.id,
      musica_id: musicaId,
      ordem: index + 1
    }));

    const { error: errJunction } = await supabase
      .from('setlist_musicas')
      .insert(records);

    if (errJunction) {
      console.error('Erro ao associar músicas ao setlist:', errJunction);
      // Opcionalmente deleta o setlist em caso de falha completa de junção
      await supabase.from('setlists').delete().eq('id', setlist.id);
      throw errJunction;
    }
  }

  return setlist;
}

export async function deletarSetlist(id: string): Promise<void> {
  const { error } = await supabase
    .from('setlists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar setlist:', error);
    throw error;
  }
}
