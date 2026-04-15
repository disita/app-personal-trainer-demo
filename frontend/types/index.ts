export type FatigueLevel = 'bajo' | 'medio' | 'alto'
export type Goal = 'ftp' | 'resistencia' | 'recuperacion' | 'fuerza'

export interface WorkoutRequest {
  availableMinutes: number
  fatigueLevel: FatigueLevel
  goal: Goal
  recentWorkouts: WorkoutRecord[]
}

export interface WorkoutResult {
  tipo: string
  duracion: number
  intensidad: string
  instrucciones: string
}

export interface WorkoutRecord {
  date: string
  tipo: string
  duracion: number
  intensidad: string
}
