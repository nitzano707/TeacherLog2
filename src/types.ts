import { Timestamp } from 'firebase/firestore';

export interface ReflectionAnalysis {
  strengths: string[];
  challenges: string[];
  suggestions: string[];
}

export interface ReflectionEntry {
  id?: string;
  userId: string;
  originalText: string;
  analysis: ReflectionAnalysis;
  createdAt: Timestamp;
}
