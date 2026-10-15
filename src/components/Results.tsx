import { useEffect, useRef } from 'react';
import type { Result } from '../types';
export function Results({result, onRetry, onHistory}: {result: Result; onRetry: () => void; onHistory: () => void}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="panel result-panel"><p className="eyebrow">PRACTICE COMPLETE</p><h2 ref={heading} tabIndex={-1}>{result.topic}</h2><p className="score">{result.score}<span> / {result.total}</span></p><p>You answered {Math.round(result.score / result.total * 100)}% correctly.</p><p className="muted">Use the explanations to guide your next practice. Every attempt is a chance to learn.</p><div className="actions"><button className="primary" onClick={onRetry}>Practise this topic again</button><button onClick={onHistory}>View history & progress</button></div></section>;
}
