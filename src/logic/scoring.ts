import type { Question, Result, Topic } from '../types';
export function validateAnswer(question: Question, selectedIndex: number): boolean {
  return Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex < question.options.length && selectedIndex === question.correctIndex;
}
export function calculateScore(bank: Question[], answers: number[]): number {
  return bank.reduce((score, question, index) => score + Number(validateAnswer(question, answers[index])), 0);
}
export function summariseTopics(history: Result[], topics: Topic[]) {
  return topics.map(topic => {
    const attempts = history.filter(result => result.topic === topic);
    const score = attempts.reduce((sum, result) => sum + result.score, 0);
    const total = attempts.reduce((sum, result) => sum + result.total, 0);
    return {topic, attempts: attempts.length, score, total, percentage: total ? Math.round(score / total * 100) : null};
  });
}
