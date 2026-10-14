export type SportType = 'ciclismo' | 'running' | 'fuerza'
export type FatigueLevel = 'bajo' | 'medio' | 'alto'
export type Goal =
  | 'resistencia'
  | 'recuperacion'
  | 'velocidad'
  | 'ftp'
  | 'ritmo'
  | 'volumen'
  | 'hipertrofia'
  | 'fuerza_max'
  | 'resistencia_muscular'

export interface PerformanceMetrics {
  ftp?: number
  paceTarget?: string
  fitnessLevel?: 'principiante' | 'intermedio' | 'avanzado'
}

export interface WorkoutRequest {
  sport: SportType
  availableMinutes: number
  fatigueLevel: FatigueLevel
  goal: Goal
  metrics: PerformanceMetrics
  recentWorkouts: WorkoutRecord[]
}

export interface WorkoutResult {
  sport: SportType
  tipo: string
  duracion: number
  intensidad: string
  instrucciones: string
}

export interface WorkoutRecord {
  date: string
  sport?: SportType
  tipo: string
  duracion: number
  intensidad: string
}
