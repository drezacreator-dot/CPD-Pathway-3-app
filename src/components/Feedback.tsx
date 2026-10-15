import type { Question } from '../types';
export function Feedback({question, correct}: {question: Question; correct: boolean}) {
  return <div className={`feedback ${correct ? 'correct' : 'incorrect'}`} role="status"><strong><span aria-hidden="true">{correct ? '✓' : '✕'}</span> {correct ? 'Correct' : 'Not quite'}</strong>{!correct && <p>Correct answer: {question.options[question.correctIndex]}</p>}<p>{question.explanation}</p></div>;
}
