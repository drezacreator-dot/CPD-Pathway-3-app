import { useEffect, useRef, useState } from 'react';
import type { Question } from '../types';
import { validateAnswer } from '../logic/scoring';
import { Feedback } from './Feedback';
export function QuestionCard({question, number, total, onNext}: {question: Question; number: number; total: number; onNext: (answer: number) => void}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  useEffect(() => { if (submitted) nextButton.current?.focus(); }, [submitted]);
  return <section className="panel question-panel"><div className="section-top"><span className="eyebrow">{question.topic}</span><span>Question {number} of {total}</span></div><progress value={number - 1} max={total} aria-label="Questions completed"/><h2 ref={heading} tabIndex={-1}>{question.question}</h2><form onSubmit={event => {event.preventDefault(); if (selected !== null && !submitted) setSubmitted(true);}}><fieldset disabled={submitted}><legend>Choose one answer</legend>{question.options.map((option, index) => <label className={`option ${selected === index ? 'selected' : ''}`} key={option}><input type="radio" name="answer" value={index} checked={selected === index} onChange={() => setSelected(index)}/><span>{option}</span></label>)}</fieldset>{!submitted && <button className="primary" disabled={selected === null} type="submit">Check answer</button>}</form>{submitted && <><Feedback question={question} correct={validateAnswer(question, selected!)}/><button className="primary" ref={nextButton} onClick={() => onNext(selected!)}>{number === total ? 'See results' : 'Next question'} <span aria-hidden="true">→</span></button></>}</section>;
}
