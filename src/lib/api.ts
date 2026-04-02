import type {
  AACProfile,
  Board,
  BoardCell,
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
    return this.request<AACProfile[]>('/profiles');
  }

  async getProfile(id: string): Promise<AACProfile> {
    return this.request<AACProfile>(`/profiles/${id}`);
  }

  async updateProfile(
    id: string,
    data: Partial<AACProfile>
  ): Promise<AACProfile> {
    return this.request<AACProfile>(`/profiles/${id}`, {
      method: 'PUT',
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
    return this.request<Board[]>(`/boards${qs ? `?${qs}` : ''}`);
  }

  async getBoard(id: string): Promise<Board> {
    return this.request<Board>(`/boards/${id}`);
  }

  async createBoard(data: Partial<Board>): Promise<Board> {
    return this.request<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<Board> {
    return this.request<Board>(`/boards/${id}`, {
      method: 'PUT',
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
      method: 'PUT',
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
    return this.request<Symbol[]>(`/symbols${qs ? `?${qs}` : ''}`);
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
    return this.request<UsageLog[]>(`/usage-logs?${searchParams.toString()}`);
  }

  // ─── Backup ───────────────────────────────────────────

  async exportData(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/export');
  }
}

export const api = new ApiClient();
