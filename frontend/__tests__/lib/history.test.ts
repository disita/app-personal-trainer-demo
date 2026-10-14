import { getHistory, saveWorkout } from '@/lib/history'
import type { WorkoutResult } from '@/types'

const MOCK_WORKOUT: WorkoutResult = {
  sport: 'ciclismo',
  tipo: 'Intervalos al umbral',
  duracion: 60,
  intensidad: '90-95% FTP',
  instrucciones: 'Calienta 15 min, luego 4x8 min al umbral con 4 min de descanso.',
}

beforeEach(() => {
  localStorage.clear()
})

describe('getHistory', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(getHistory()).toEqual([])
  })

  it('returns parsed records from localStorage', () => {
    const records = [{ date: '2026-01-01T00:00:00.000Z', sport: 'ciclismo', tipo: 'Test', duracion: 30, intensidad: 'baja' }]
    localStorage.setItem('trainer_history', JSON.stringify(records))
    expect(getHistory()).toEqual(records)
  })

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('trainer_history', 'not-json')
    expect(getHistory()).toEqual([])
  })
})

describe('saveWorkout', () => {
  it('saves a workout record to localStorage', () => {
    saveWorkout(MOCK_WORKOUT)
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].tipo).toBe(MOCK_WORKOUT.tipo)
    expect(history[0].sport).toBe(MOCK_WORKOUT.sport)
    expect(history[0].duracion).toBe(MOCK_WORKOUT.duracion)
    expect(history[0].intensidad).toBe(MOCK_WORKOUT.intensidad)
  })

  it('prepends new workouts so the most recent is first', () => {
    saveWorkout({ ...MOCK_WORKOUT, tipo: 'Primero' })
    saveWorkout({ ...MOCK_WORKOUT, tipo: 'Segundo' })
    const history = getHistory()
    expect(history[0].tipo).toBe('Segundo')
    expect(history[1].tipo).toBe('Primero')
  })

  it('caps history at 7 records', () => {
    for (let i = 0; i < 10; i++) {
      saveWorkout({ ...MOCK_WORKOUT, tipo: `Entrenamiento ${i}` })
    }
    expect(getHistory()).toHaveLength(7)
  })

  it('saves exactly 7 records without dropping any when limit is reached', () => {
    for (let i = 0; i < 7; i++) {
      saveWorkout({ ...MOCK_WORKOUT, tipo: `Entrenamiento ${i}` })
    }
    expect(getHistory()).toHaveLength(7)
    expect(getHistory()[0].tipo).toBe('Entrenamiento 6')
    expect(getHistory()[6].tipo).toBe('Entrenamiento 0')
  })

  it('keeps the most recent records when capping', () => {
    for (let i = 0; i < 10; i++) {
      saveWorkout({ ...MOCK_WORKOUT, tipo: `Entrenamiento ${i}` })
    }
    expect(getHistory()[0].tipo).toBe('Entrenamiento 9')
  })

  it('stores a valid ISO date string on each record', () => {
    saveWorkout(MOCK_WORKOUT)
    const date = getHistory()[0].date
    expect(isNaN(new Date(date).getTime())).toBe(false)
  })
})
