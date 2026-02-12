
export type UserRole = 'user' | 'admin';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Modality = 'image' | 'video' | 'audio' | 'document';
export type PlanType = 'Basic' | 'Pro' | 'Enterprise';
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'kn' | 'gu' | 'ta';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  credits: number;
  totalCredits: number;
  riskScore: number;
  createdAt: string;
  lastLogin?: string;
  photoURL?: string;
}

export interface FraudAlert {
  id: string;
  timestamp: string;
  reason: string;
  email: string;
}

export interface ForensicFinding {
  label: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface DetectionResult {
  modality: Modality;
  aiPercentage: number;
  humanPercentage: number;
  confidence: number;
  verdict: 'REAL' | 'DEEPFAKE' | 'SUSPICIOUS';
  findings: ForensicFinding[];
  summary: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  date: string;
  location: string;
  imageUrl?: string;
  sources: { title: string; uri: string }[];
}

export interface AnalysisHistory {
  id: string;
  timestamp: string;
  thumbnail: string;
  result: DetectionResult;
}

export interface CreditRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  packLabel: string;
  price: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type TabType = 'dashboard' | 'history' | 'notifications' | 'profile' | 'settings' | 'lab' | 'legal' | 'protect' | 'protect_register' | 'protect_list' | 'protect_verify' | 'protect_disputes' | 'privacy' | 'terms' | 'whitepaper';
