import { describe, expect, it } from 'vitest';
import { getQuestions, questions, topics } from '../data/questions';
import { calculateScore, summariseTopics, validateAnswer } from '../logic/scoring';
import { clearHistory, HISTORY_KEY, loadHistory, saveHistory } from '../logic/storage';
import type { Result } from '../types';
const result: Result = {id:'demo-1', topic:'Inference', score:3, total:5, completedAt:'2026-10-15T12:00:00.000Z'};
function memoryStorage() {
  const data = new Map<string,string>();
  return {getItem:(key:string) => data.get(key) ?? null, setItem:(key:string,value:string) => {data.set(key,value);}, removeItem:(key:string) => {data.delete(key);}};
}
describe('question bank', () => {
  it('contains five valid questions per topic with unique IDs', () => {
    expect(new Set(questions.map(q => q.id)).size).toBe(10);
    for (const topic of topics) expect(getQuestions(topic)).toHaveLength(5);
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });
});
describe('answer validation and scoring', () => {
  it('accepts only the correct stored index', () => {
    for (const q of questions) for (let i=0;i<4;i++) expect(validateAnswer(q,i)).toBe(i === q.correctIndex);
  });
  it('rejects invalid answer indices', () => {
    for (const index of [-1,4,NaN,Infinity,0.5]) expect(validateAnswer(questions[0],index)).toBe(false);
  });
  it('scores perfect, wrong, mixed and incomplete attempts', () => {
    const bank = getQuestions('Inference');
    expect(calculateScore(bank,[0,1,2,3,0])).toBe(5);
    expect(calculateScore(bank,[1,2,3,0,1])).toBe(0);
    expect(calculateScore(bank,[0,1,0,0,0])).toBe(3);
    expect(calculateScore(bank,[0])).toBe(1);
    expect(calculateScore([],[])).toBe(0);
  });
});
describe('topic summary', () => {
  it('distinguishes unattempted topics from zero scores', () => {
    expect(summariseTopics([],topics)[0]).toMatchObject({attempts:0,percentage:null});
    expect(summariseTopics([{...result,score:0}],topics)[0].percentage).toBe(0);
  });
  it('aggregates by topic and weights accuracy by question count', () => {
    const history = [result,{...result,id:'2',score:1,total:2},{...result,id:'3',topic:'Persuasive techniques' as const,score:5}];
    expect(summariseTopics(history,topics)).toEqual([
      {topic:'Inference',attempts:2,score:4,total:7,percentage:57},
      {topic:'Persuasive techniques',attempts:1,score:5,total:5,percentage:100}
    ]);
  });
});
describe('history storage', () => {
  it('saves and reloads results through a fresh read', () => {
    const storage = memoryStorage();
    expect(saveHistory([result],storage)).toBe(true);
    expect(JSON.parse(storage.getItem(HISTORY_KEY)!)).toEqual([result]);
    expect(loadHistory(storage)).toEqual({results:[result],warning:''});
    expect(clearHistory(storage)).toBe(true);
    expect(loadHistory(storage).results).toEqual([]);
  });
  it('handles missing storage', () => expect(loadHistory(memoryStorage())).toEqual({results:[],warning:''}));
  it('handles corrupted JSON and invalid result schemas', () => {
    for (const raw of ['{broken','{}','[null]',JSON.stringify([{...result,score:6}]),JSON.stringify([{...result,total:0}]),JSON.stringify([{...result,completedAt:'invalid'}]),JSON.stringify([{...result,topic:'Unknown'}])]) {
      const storage = memoryStorage(); storage.setItem(HISTORY_KEY,raw);
      expect(loadHistory(storage).results).toEqual([]);
      expect(loadHistory(storage).warning).not.toBe('');
    }
  });
  it('reports blocked reads, writes and deletes without throwing', () => {
    const storage = {getItem:() => {throw Error('blocked');},setItem:() => {throw Error('quota');},removeItem:() => {throw Error('blocked');}};
    expect(loadHistory(storage).warning).not.toBe('');
    expect(saveHistory([result],storage)).toBe(false);
    expect(clearHistory(storage)).toBe(false);
  });
});
