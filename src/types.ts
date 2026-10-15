export type Topic = 'Inference' | 'Persuasive techniques';
export interface Question {
  id: string;
  topic: Topic;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}
export interface Result {
  id: string;
  topic: Topic;
  score: number;
  total: number;
  completedAt: string;
}
