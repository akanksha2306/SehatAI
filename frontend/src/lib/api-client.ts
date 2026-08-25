const API_URL = import.meta.env.VITE_API_URL;

export interface AuthUser {
  id: string;
  email: string;
}

export interface VerifyResponse {
  token: string;
  user: AuthUser;
}

export interface MagicLinkResponse {
  message: string;
  // Present only for the temporary dev-bypass email — see AuthController.
  // Remove this field along with the backend bypass before shipping.
  token?: string;
  user?: AuthUser;
}

export interface MeResponse {
  id: string;
  email: string;
  onboarded?: boolean;
  stats?: {
    creditsTotal: number;
    currentStreak: number;
  };
}

export interface ChapterListItem {
  index: number;
  title: string;
  reward: number;
  locked: boolean;
  completed: boolean;
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  correct: number;
  explain: string;
}

export interface ChapterExample {
  weakPrompt: string;
  weakOutput: string;
  strongPrompt: string;
  strongOutput: string;
}

export interface ChapterDetail {
  title: string;
  paras: string[];
  key: string;
  quiz: QuizQuestion[];
  reward: number;
  example?: ChapterExample | null;
}

export interface ChapterProgressRecord {
  id: string;
  userId: string;
  track: string;
  chapterIndex: number;
  completedAt: string;
  quizScore: number;
  creditsEarned: number;
}

export interface CompleteChapterResponse {
  progress: ChapterProgressRecord;
  creditsTotal: number;
}

export interface ImprovePromptResponse {
  improved: string;
}

export interface TranslateScribeResponse {
  translated: string;
}

export interface GenerateWorkflowRequest {
  task: string;
  description?: string;
}

export interface GenerateWorkflowResponse {
  output: string;
}

export interface SaveWorkflowRequest {
  task: string;
  description?: string;
  output: string;
}

export interface SavedWorkflow {
  id: string;
  task: string;
  description?: string;
  output: string;
  createdAt: string;
}

export interface SaveWorkflowResponse {
  id: string;
  task: string;
  description?: string;
  output: string;
  createdAt: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    // Nullish coalescing, not ||: an explicitly empty VITE_API_URL means
    // "same-origin, use relative /api/... paths" (the single-Docker-service
    // deploy sets it to "" on purpose) — only fall back to localhost when
    // the var isn't set at all (local dev with no .env).
    this.baseUrl = API_URL ?? "http://localhost:4000";
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem("sehatai_token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(typeof options.headers === "object" && options.headers !== null
        ? (options.headers as Record<string, string>)
        : {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
      (error as unknown as Record<string, unknown>).status = response.status;
      throw error;
    }

    return response.json() as Promise<T>;
  }

  async requestMagicLink(email: string): Promise<MagicLinkResponse> {
    return this.fetch<MagicLinkResponse>("/api/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyCode(email: string, code: string): Promise<VerifyResponse> {
    return this.fetch<VerifyResponse>("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }

  async verifyToken(token: string): Promise<VerifyResponse> {
    return this.fetch<VerifyResponse>(
      `/api/auth/verify?token=${encodeURIComponent(token)}`
    );
  }

  async getMe(): Promise<MeResponse> {
    return this.fetch<MeResponse>("/api/me");
  }

  async submitOnboarding(data: {
    confidence: string;
    challenges: string[];
    goal: string;
    timeCadence: string;
  }): Promise<Record<string, unknown>> {
    return this.fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getOnboarding(): Promise<Record<string, unknown> | null> {
    try {
      return this.fetch("/api/onboarding");
    } catch (err) {
      if (
        err instanceof Error &&
        typeof (err as unknown as Record<string, unknown>).status === "number" &&
        (err as unknown as Record<string, unknown>).status === 404
      ) {
        return null;
      }
      throw err;
    }
  }

  async getCourseChapters(track: string): Promise<ChapterListItem[]> {
    // Backend returns { track, chapters: [...] }, not a bare array — unwrap it.
    const response = await this.fetch<{ track: string; chapters: ChapterListItem[] }>(
      `/api/courses/${encodeURIComponent(track)}/chapters`
    );
    return response.chapters;
  }

  async getChapterDetail(
    track: string,
    index: number
  ): Promise<ChapterDetail> {
    return this.fetch<ChapterDetail>(
      `/api/courses/${encodeURIComponent(track)}/chapters/${index}`
    );
  }

  async completeChapter(
    track: string,
    index: number,
    quizScore: number
  ): Promise<CompleteChapterResponse> {
    return this.fetch<CompleteChapterResponse>(
      `/api/courses/${encodeURIComponent(track)}/chapters/${index}/complete`,
      {
        method: "POST",
        body: JSON.stringify({ quizScore }),
      }
    );
  }

  async improvePrompt(prompt: string): Promise<ImprovePromptResponse> {
    return this.fetch<ImprovePromptResponse>("/api/prompt/improve", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
  }

  async translateScribe(
    transcript: string,
    dialect: string
  ): Promise<TranslateScribeResponse> {
    return this.fetch<TranslateScribeResponse>("/api/scribe/translate", {
      method: "POST",
      body: JSON.stringify({ transcript, dialect }),
    });
  }

  async generateWorkflow(
    data: GenerateWorkflowRequest
  ): Promise<GenerateWorkflowResponse> {
    return this.fetch<GenerateWorkflowResponse>("/api/workflow/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async saveWorkflow(
    data: SaveWorkflowRequest
  ): Promise<SaveWorkflowResponse> {
    return this.fetch<SaveWorkflowResponse>("/api/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSavedWorkflows(): Promise<SavedWorkflow[]> {
    return this.fetch<SavedWorkflow[]>("/api/workflows");
  }
}

export const apiClient = new ApiClient();
