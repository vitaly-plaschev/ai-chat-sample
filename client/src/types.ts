export interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Settings {
  temperature: number;
  maxTokens: number;
  model: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  settings: Settings;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}