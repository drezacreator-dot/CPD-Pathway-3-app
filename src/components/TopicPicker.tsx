import { getQuestions, topics } from '../data/questions';
import type { Topic } from '../types';
export function TopicPicker({onStart}: {onStart: (topic: Topic) => void}) {
  return <section aria-labelledby="topics-title"><h2 id="topics-title">Choose your focus</h2><p className="muted">Five questions. A few minutes. A little more confidence.</p><div className="topic-grid">{topics.map((topic, index) => <article className="topic-card" key={topic}><span className="topic-number" aria-hidden="true">0{index + 1}</span><p className="eyebrow">READING & LANGUAGE</p><h3>{topic}</h3><p>{index === 0 ? 'Read between the lines. Use evidence to work out what a writer suggests.' : 'Explore how writers use language to influence an audience.'}</p><div className="card-bottom"><span>{getQuestions(topic).length} questions</span><button onClick={() => onStart(topic)}>Start practice <span aria-hidden="true">↗</span></button></div></article>)}</div></section>;
}
