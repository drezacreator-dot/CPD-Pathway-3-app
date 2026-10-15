import { topics } from '../data/questions';
import type { Result } from '../types';
export const HISTORY_KEY = 'year9-english-revision-history-v1';
type StorageAccess = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export interface LoadedHistory { results: Result[]; warning: string; }
function isResult(value: unknown): value is Result {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return typeof r.id === 'string' && r.id.length > 0 && topics.includes(r.topic as Result['topic']) &&
    typeof r.score === 'number' && Number.isInteger(r.score) && r.score >= 0 &&
    typeof r.total === 'number' && Number.isInteger(r.total) && r.total > 0 && r.score <= r.total &&
    typeof r.completedAt === 'string' && Number.isFinite(Date.parse(r.completedAt));
}
// Copy only the declared result fields; arbitrary extra stored fields never enter app state.
export function loadHistory(storage?: StorageAccess): LoadedHistory {
  try {
    const raw = (storage ?? window.localStorage).getItem(HISTORY_KEY);
    if (!raw) return {results: [], warning: ''};
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isResult)) throw new Error('Invalid history');
    return {results: parsed.map(({id, topic, score, total, completedAt}) => ({id, topic, score, total, completedAt})), warning: ''};
  } catch {
    return {results: [], warning: 'Saved history could not be read. You can still practise; clear history to reset it.'};
  }
}
export function saveHistory(results: Result[], storage?: StorageAccess): boolean {
  try { (storage ?? window.localStorage).setItem(HISTORY_KEY, JSON.stringify(results)); return true; }
  catch { return false; }
}
export function clearHistory(storage?: StorageAccess): boolean {
  try { (storage ?? window.localStorage).removeItem(HISTORY_KEY); return true; }
  catch { return false; }
}
