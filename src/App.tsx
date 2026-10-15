import { useState } from 'react';
import { Attempt } from './components/Attempt';
import { TopicPicker } from './components/TopicPicker';
import { Results } from './components/Results';
import { History } from './components/History';
import { PerformanceSummary } from './components/PerformanceSummary';
import { clearHistory, loadHistory, saveHistory } from './logic/storage';
import type { Result, Topic } from './types';
type View = {kind: 'topics'} | {kind: 'attempt'; topic: Topic; key: number} | {kind: 'results'; result: Result} | {kind: 'history'};
export default function App() {
  const [initial] = useState(loadHistory);
  const [history, setHistory] = useState(initial.results);
  const [warning, setWarning] = useState(initial.warning);
  const [view, setView] = useState<View>({kind: 'topics'});
  const [attemptKey, setAttemptKey] = useState(0);
  function start(topic: Topic) {
    setAttemptKey(attemptKey + 1);
    setView({kind: 'attempt', topic, key: attemptKey + 1});
  }
  function complete(result: Result) {
    const updated = [...history, result];
    setHistory(updated);
    setWarning(saveHistory(updated) ? '' : 'This attempt is visible now, but could not be saved. It may be lost after refresh.');
    setView({kind: 'results', result});
  }
  function clear() {
    if (!window.confirm('Clear all revision results from this browser? This cannot be undone.')) return;
    if (clearHistory()) { setHistory([]); setWarning(''); }
    else setWarning('History could not be cleared. Your results have been kept.');
  }
  return <><a className="skip-link" href="#main">Skip to content</a><header><div className="brand"><span className="brand-mark" aria-hidden="true">E.</span><div>English Revision<small>YEAR 9 · PRACTICE SPACE</small></div></div><nav aria-label="Main navigation"><button aria-current={view.kind === 'topics' ? 'page' : undefined} onClick={() => setView({kind:'topics'})}>Topics</button><button aria-current={view.kind === 'history' ? 'page' : undefined} onClick={() => setView({kind:'history'})}>History & progress</button></nav></header><main id="main"><div className="intro"><p className="eyebrow">SMALL STEPS. STRONGER UNDERSTANDING.</p><h1>A little practice.<br/><em>A clearer understanding.</em></h1><p>Build your English skills, one question at a time.<br/>Choose a topic, try it out and learn from the feedback.</p></div>{warning && <p className="warning" role="alert">⚠ {warning}</p>}{view.kind === 'attempt' && <Attempt key={view.key} topic={view.topic} onComplete={complete}/>}{view.kind === 'results' && <Results result={view.result} onRetry={() => start(view.result.topic)} onHistory={() => setView({kind:'history'})}/>}{view.kind === 'history' && <div className="stack"><PerformanceSummary history={history}/><History history={history} onClear={clear}/></div>}<div className={view.kind === 'topics' ? '' : 'restart-topics'}><TopicPicker onStart={start}/></div></main><footer><span>Made for practice, not pressure.</span><span>Demonstration content · Results stay in this browser</span></footer></>;
}
