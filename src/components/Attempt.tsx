import { useState } from 'react';
import { getQuestions } from '../data/questions';
import { calculateScore } from '../logic/scoring';
import type { Result, Topic } from '../types';
import { QuestionCard } from './QuestionCard';
export function Attempt({topic, onComplete}: {topic: Topic; onComplete: (result: Result) => void}) {
  const [answers, setAnswers] = useState<number[]>([]);
  const bank = getQuestions(topic);
  function next(answer: number) {
    const updated = [...answers, answer];
    if (updated.length === bank.length) {
      onComplete({id: crypto.randomUUID(), topic, score: calculateScore(bank, updated), total: bank.length, completedAt: new Date().toISOString()});
    } else setAnswers(updated);
  }
  return <QuestionCard key={bank[answers.length].id} question={bank[answers.length]} number={answers.length + 1} total={bank.length} onNext={next}/>;
}
