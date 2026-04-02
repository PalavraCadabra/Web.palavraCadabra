export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'patient' | 'caregiver' | 'therapist' | 'admin';
  is_active: boolean;
}

export interface AACProfile {
  id: string;
  user_id: string;
  name: string;
  communication_level:
    | 'pre_symbolic'
    | 'symbolic'
    | 'emerging_language'
    | 'contextual_language';
  motor_capability:
    | 'full_touch'
    | 'limited_touch'
    | 'switch_scanning'
    | 'eye_gaze';
  visual_capability: 'standard' | 'low_vision' | 'high_contrast_needed';
  preferred_voice: string;
  grid_size_preference: string | null;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: string;
  profile_id: string | null;
  name: string;
  board_type: 'core' | 'category' | 'personal' | 'activity';
  grid_rows: number;
  grid_cols: number;
  is_template: boolean;
  parent_board_id: string | null;
  cells: BoardCell[];
  created_at: string;
  updated_at: string;
}

export interface BoardCell {
  id: string;
  board_id: string;
  position_row: number;
  position_col: number;
  symbol_id: string | null;
  label_override: string | null;
  action: 'speak' | 'navigate' | 'modifier';
  action_target: string | null;
  background_color: string;
  is_hidden: boolean;
}

export interface Symbol {
  id: string;
  arasaac_id: number | null;
  label_pt: string;
  category: string;
  image_url: string;
  grammatical_class:
    | 'pronoun'
    | 'verb'
    | 'adjective'
    | 'noun'
    | 'social_phrase'
    | 'misc'
    | 'question';
  fitzgerald_color: string;
  frequency_rank: number | null;
  keywords: string[] | null;
}

export interface UsageLog {
  id: string;
  profile_id: string;
  timestamp: string;
  event_type: string;
  event_data: Record<string, unknown> | null;
  session_id: string | null;
}

export interface CareRelationship {
  id: string;
  user_id: string;
  profile_id: string;
  relationship_type: 'caregiver' | 'therapist' | 'teacher' | 'admin';
  permissions: Record<string, unknown>;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const COMMUNICATION_LEVEL_LABELS: Record<
  AACProfile['communication_level'],
  string
> = {
  pre_symbolic: 'Pre-simbólico',
  symbolic: 'Simbólico',
  emerging_language: 'Linguagem emergente',
  contextual_language: 'Linguagem contextual',
};

export const MOTOR_CAPABILITY_LABELS: Record<
  AACProfile['motor_capability'],
  string
> = {
  full_touch: 'Toque completo',
  limited_touch: 'Toque limitado',
  switch_scanning: 'Varredura por switch',
  eye_gaze: 'Rastreamento ocular',
};

export const VISUAL_CAPABILITY_LABELS: Record<
  AACProfile['visual_capability'],
  string
> = {
  standard: 'Padrão',
  low_vision: 'Baixa visão',
  high_contrast_needed: 'Alto contraste necessário',
};

export const BOARD_TYPE_LABELS: Record<Board['board_type'], string> = {
  core: 'Vocabulário central',
  category: 'Categoria',
  personal: 'Pessoal',
  activity: 'Atividade',
};

export const GRAMMATICAL_CLASS_LABELS: Record<
  Symbol['grammatical_class'],
  string
> = {
  pronoun: 'Pronome',
  verb: 'Verbo',
  adjective: 'Adjetivo',
  noun: 'Substantivo',
  social_phrase: 'Frase social',
  misc: 'Diversos',
  question: 'Pergunta',
};

export const FITZGERALD_COLORS: Record<Symbol['grammatical_class'], string> = {
  pronoun: '#FFD700',
  verb: '#4CAF50',
  adjective: '#2196F3',
  noun: '#FF9800',
  social_phrase: '#E91E63',
  misc: '#9E9E9E',
  question: '#9C27B0',
};
