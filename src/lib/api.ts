import type {
  AACProfile,
  ActivityResult,
  Board,
  BoardCell,
  CareRelationship,
  InviteRequest,
  InviteResponse,
  LiteracyActivity,
  LiteracyProgram,
  LiteracyProgress,
  LoginResponse,
  Symbol,
  UsageLog,
  User,
} from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken() {
    return this.token;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...headers, ...(options?.headers as Record<string, string>) },
      // Don't follow redirects — FastAPI 307 to trailing-slash loses POST body
      redirect: 'error',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(
        `API error ${res.status}: ${res.statusText}${body ? ` - ${body}` : ''}`
      );
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // ─── Auth ─────────────────────────────────────────────

  async login(email: string, password: string): Promise<LoginResponse> {
    const data = new URLSearchParams();
    data.append('username', email);
    data.append('password', password);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
    });

    if (!res.ok) {
      throw new Error('Credenciais inválidas');
    }

    const result: LoginResponse = await res.json();
    this.setToken(result.access_token);
    return result;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // ─── Profiles ─────────────────────────────────────────

  async getProfiles(): Promise<AACProfile[]> {
    return this.request<AACProfile[]>('/profiles/');
  }

  async getProfile(id: string): Promise<AACProfile> {
    return this.request<AACProfile>(`/profiles/${id}`);
  }

  async updateProfile(
    id: string,
    data: Partial<AACProfile>
  ): Promise<AACProfile> {
    return this.request<AACProfile>(`/profiles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ─── Boards ───────────────────────────────────────────

  async getBoards(params?: {
    profile_id?: string;
    templates_only?: boolean;
  }): Promise<Board[]> {
    const searchParams = new URLSearchParams();
    if (params?.profile_id) searchParams.set('profile_id', params.profile_id);
    if (params?.templates_only) searchParams.set('templates_only', 'true');
    const qs = searchParams.toString();
    return this.request<Board[]>(`/boards/${qs ? `?${qs}` : ''}`);
  }

  async getBoard(id: string): Promise<Board> {
    return this.request<Board>(`/boards/${id}`);
  }

  async createBoard(data: Partial<Board>): Promise<Board> {
    return this.request<Board>('/boards/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<Board> {
    return this.request<Board>(`/boards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string): Promise<void> {
    return this.request<void>(`/boards/${id}`, { method: 'DELETE' });
  }

  // ─── Cells ────────────────────────────────────────────

  async addCell(boardId: string, data: Partial<BoardCell>): Promise<BoardCell> {
    return this.request<BoardCell>(`/boards/${boardId}/cells`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCell(
    boardId: string,
    cellId: string,
    data: Partial<BoardCell>
  ): Promise<BoardCell> {
    return this.request<BoardCell>(`/boards/${boardId}/cells/${cellId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCell(boardId: string, cellId: string): Promise<void> {
    return this.request<void>(`/boards/${boardId}/cells/${cellId}`, {
      method: 'DELETE',
    });
  }

  // ─── Symbols ──────────────────────────────────────────

  async getSymbols(params?: {
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<Symbol[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return this.request<Symbol[]>(`/symbols/${qs ? `?${qs}` : ''}`);
  }

  async getSymbolsByIds(ids: string[]): Promise<Symbol[]> {
    return this.request<Symbol[]>('/symbols/batch', {
      method: 'POST',
      body: JSON.stringify(ids),
    });
  }

  // ─── Usage Logs ───────────────────────────────────────

  async getUsageLogs(params: {
    profile_id: string;
    event_type?: string;
    limit?: number;
  }): Promise<UsageLog[]> {
    const searchParams = new URLSearchParams();
    searchParams.set('profile_id', params.profile_id);
    if (params.event_type) searchParams.set('event_type', params.event_type);
    if (params.limit) searchParams.set('limit', String(params.limit));
    return this.request<UsageLog[]>(`/usage-logs/?${searchParams.toString()}`);
  }

  // ─── Literacy ─────────────────────────────────────────

  async getLiteracyPrograms(profileId?: string): Promise<LiteracyProgram[]> {
    const searchParams = new URLSearchParams();
    if (profileId) searchParams.set('profile_id', profileId);
    const qs = searchParams.toString();
    return this.request<LiteracyProgram[]>(`/literacy/programs${qs ? `?${qs}` : ''}`);
  }

  async createLiteracyProgram(data: Partial<LiteracyProgram>): Promise<LiteracyProgram> {
    return this.request<LiteracyProgram>('/literacy/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLiteracyProgram(id: string, data: Partial<LiteracyProgram>): Promise<LiteracyProgram> {
    return this.request<LiteracyProgram>(`/literacy/programs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getLiteracyActivities(stage?: string): Promise<LiteracyActivity[]> {
    const searchParams = new URLSearchParams();
    if (stage) searchParams.set('stage', stage);
    const qs = searchParams.toString();
    return this.request<LiteracyActivity[]>(`/literacy/activities${qs ? `?${qs}` : ''}`);
  }

  async getActivityResults(programId?: string, profileId?: string): Promise<ActivityResult[]> {
    const searchParams = new URLSearchParams();
    if (programId) searchParams.set('program_id', programId);
    if (profileId) searchParams.set('profile_id', profileId);
    const qs = searchParams.toString();
    return this.request<ActivityResult[]>(`/literacy/results${qs ? `?${qs}` : ''}`);
  }

  async getLiteracyProgress(programId: string): Promise<LiteracyProgress> {
    return this.request<LiteracyProgress>(`/literacy/progress/${programId}`);
  }

  // ─── Care Relationships ─────────────────────────────

  async getCareRelationships(profileId?: string): Promise<CareRelationship[]> {
    const searchParams = new URLSearchParams();
    if (profileId) searchParams.set('profile_id', profileId);
    const qs = searchParams.toString();
    return this.request<CareRelationship[]>(`/care/${qs ? `?${qs}` : ''}`);
  }

  async getMyPatients(): Promise<CareRelationship[]> {
    return this.request<CareRelationship[]>('/care/my-patients');
  }

  async inviteToCare(data: InviteRequest): Promise<InviteResponse> {
    return this.request<InviteResponse>('/care/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeCareRelationship(id: string): Promise<void> {
    return this.request<void>(`/care/${id}`, { method: 'DELETE' });
  }

  // ─── Research ──────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getResearchCommunicationStats(params?: {
    since?: string;
    until?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.since) searchParams.set('since', params.since);
    if (params?.until) searchParams.set('until', params.until);
    const qs = searchParams.toString();
    return this.request(
      `/research/aggregate/communication${qs ? `?${qs}` : ''}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getResearchVocabularyStats(): Promise<any> {
    return this.request('/research/aggregate/vocabulary');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getResearchLiteracyStats(): Promise<any> {
    return this.request('/research/aggregate/literacy');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getResearchCohorts(): Promise<any> {
    return this.request('/research/cohorts');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exportResearchData(format: string = 'json'): Promise<any> {
    return this.request(
      `/research/export/anonymized?format=${format}`
    );
  }

  // ─── Backup ───────────────────────────────────────────

  async exportData(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/backup/export');
  }
}

export const api = new ApiClient();
