-- Script SQL para criar as tabelas do Setlist Manager Pro no Supabase
-- Copie e cole este script no SQL Editor do seu painel Supabase.

-- Habilitar a extensão uuid-ossp se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Musicas
CREATE TABLE IF NOT EXISTS public.musicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    artista TEXT NOT NULL,
    genero TEXT DEFAULT 'Desconhecido',
    duracao TEXT DEFAULT '-', -- Formato 'MM:SS' ou similar
    tipo TEXT DEFAULT 'Cover', -- 'Autoral' ou 'Cover'
    tom TEXT DEFAULT '-',      -- Tom musical (ex: E, G#m, Drop D)
    bpm TEXT DEFAULT '-',      -- Batidas por minuto
    status TEXT DEFAULT 'Pendente', -- 'Pendente', 'Em ensaio', 'Pronta'
    observacoes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Setlists
CREATE TABLE IF NOT EXISTS public.setlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Relacionamento (Muitos para Muitos) entre Setlists e Musicas
CREATE TABLE IF NOT EXISTS public.setlist_musicas (
    setlist_id UUID REFERENCES public.setlists(id) ON DELETE CASCADE,
    musica_id UUID REFERENCES public.musicas(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    PRIMARY KEY (setlist_id, musica_id)
);

-- Configurando RLS (Row Level Security) - Como o projeto usa anon_key, vamos liberar acesso público para testes fáceis.
ALTER TABLE public.musicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setlist_musicas ENABLE ROW LEVEL SECURITY;

-- Criando políticas para permitir acesso geral (Select, Insert, Update, Delete) com a chave anônima pública.
CREATE POLICY "Permitir leitura pública de musicas" ON public.musicas FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de musicas" ON public.musicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de musicas" ON public.musicas FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção pública de musicas" ON public.musicas FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de setlists" ON public.setlists FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de setlists" ON public.setlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir deleção pública de setlists" ON public.setlists FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de setlist_musicas" ON public.setlist_musicas FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de setlist_musicas" ON public.setlist_musicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir deleção pública de setlist_musicas" ON public.setlist_musicas FOR DELETE USING (true);

-- 4. Tabela de Avaliações/Comentários
CREATE TABLE IF NOT EXISTS public.avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    musica_id UUID REFERENCES public.musicas(id) ON DELETE CASCADE NOT NULL,
    autor TEXT NOT NULL,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de avaliacoes" ON public.avaliacoes FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de avaliacoes" ON public.avaliacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir deleção pública de avaliacoes" ON public.avaliacoes FOR DELETE USING (true);

