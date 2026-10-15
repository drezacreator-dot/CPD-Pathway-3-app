import { topics } from '../data/questions';
import { summariseTopics } from '../logic/scoring';
import type { Result } from '../types';
export function PerformanceSummary({history}: {history: Result[]}) {
  return <section aria-labelledby="summary-title"><h2 id="summary-title">Your topic performance</h2><p className="muted">Accuracy across all completed questions in each topic.</p><div className="topic-grid">{summariseTopics(history, topics).map(summary => <article className="panel" key={summary.topic}><h3>{summary.topic}</h3><p className="summary-number">{summary.percentage === null ? '—' : `${summary.percentage}%`}</p><p>{summary.attempts ? `${summary.attempts} ${summary.attempts === 1 ? 'attempt' : 'attempts'} · ${summary.score}/${summary.total} correct` : 'No attempts yet'}</p>{summary.percentage !== null && <progress value={summary.percentage} max={100} aria-label={`${summary.topic} accuracy`}/>}</article>)}</div></section>;
}
