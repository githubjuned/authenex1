
export interface DetectionResult {
  aiPercentage: number;
  humanPercentage: number;
  confidence: number;
  verdict: 'AI' | 'HUMAN' | 'UNCERTAIN';
  findings: string[];
  categoryScores?: {
    texture: number;
    anatomy: number;
    lighting: number;
    background: number;
    semantics: number;
  };
  metadata: {
    potentialModel?: string;
    artifactsDetected: string[];
  };
  timestamp?: number;
  imageUrl?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export type NavTab = 'dashboard' | 'history' | 'security' | 'settings';

export interface NewsItem {
  title: string;
  summary: string;
  date: string;
  location: string;
  sourceLink: string;
}
