import type { WorkoutRecord, WorkoutResult } from '@/types'

const STORAGE_KEY = 'trainer_history'
const MAX_RECORDS = 7

export function getHistory(): WorkoutRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveWorkout(result: WorkoutResult): void {
  const history = getHistory()
  const record: WorkoutRecord = {
    date: new Date().toISOString(),
    sport: result.sport,
    tipo: result.tipo,
    duracion: result.duracion,
    intensidad: result.intensidad,
  }
  const updated = [record, ...history].slice(0, MAX_RECORDS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Storage full or unavailable — silently skip persistence
  }
}
