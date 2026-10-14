import { buildPrompt } from '@/lib/buildPrompt'
import type { WorkoutRequest } from '@/types'

const BASE_REQUEST: WorkoutRequest = {
  sport: 'ciclismo',
  availableMinutes: 60,
  fatigueLevel: 'medio',
  goal: 'ftp',
  metrics: { fitnessLevel: 'intermedio' },
  recentWorkouts: [],
}

describe('buildPrompt', () => {
  it('includes the sport label in the prompt', () => {
    const prompt = buildPrompt(BASE_REQUEST)
    expect(prompt).toContain('ciclismo')
  })

  it('includes available minutes', () => {
    const prompt = buildPrompt(BASE_REQUEST)
    expect(prompt).toContain('60 minutos')
  })

  it('maps bajo fatigue to "baja"', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, fatigueLevel: 'bajo' })
    expect(prompt).toContain('Nivel de fatiga actual: baja')
  })

  it('maps medio fatigue to "media"', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, fatigueLevel: 'medio' })
    expect(prompt).toContain('Nivel de fatiga actual: media')
  })

  it('maps alto fatigue to "alta"', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, fatigueLevel: 'alto' })
    expect(prompt).toContain('Nivel de fatiga actual: alta')
  })

  it('includes goal label for ftp', () => {
    const prompt = buildPrompt(BASE_REQUEST)
    expect(prompt).toContain('FTP')
  })

  it('includes fitness level metric', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, metrics: { fitnessLevel: 'avanzado' } })
    expect(prompt).toContain('avanzado')
  })

  it('includes FTP watts when provided', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, metrics: { ftp: 250 } })
    expect(prompt).toContain('250 W')
  })

  it('includes pace target when provided', () => {
    const prompt = buildPrompt({
      ...BASE_REQUEST,
      sport: 'running',
      goal: 'ritmo',
      metrics: { paceTarget: '5:30' },
    })
    expect(prompt).toContain('5:30')
  })

  it('shows "Sin entrenamientos recientes" when history is empty', () => {
    const prompt = buildPrompt(BASE_REQUEST)
    expect(prompt).toContain('Sin entrenamientos recientes')
  })

  it('shows "Sin métricas registradas" when metrics object is empty', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, metrics: {} })
    expect(prompt).toContain('Sin métricas registradas')
  })

  it('includes up to 3 recent workouts in the summary', () => {
    const request: WorkoutRequest = {
      ...BASE_REQUEST,
      recentWorkouts: [
        { date: '2026-01-01T00:00:00.000Z', tipo: 'Intervalos', duracion: 60, intensidad: 'alta' },
        { date: '2026-01-02T00:00:00.000Z', tipo: 'Rodada suave', duracion: 90, intensidad: 'baja' },
        { date: '2026-01-03T00:00:00.000Z', tipo: 'FTP test', duracion: 45, intensidad: 'máxima' },
        { date: '2026-01-04T00:00:00.000Z', tipo: 'Cuarto', duracion: 30, intensidad: 'media' },
      ],
    }
    const prompt = buildPrompt(request)
    expect(prompt).toContain('Intervalos (60 min, alta)')
    expect(prompt).toContain('Rodada suave (90 min, baja)')
    expect(prompt).toContain('FTP test (45 min, máxima)')
    expect(prompt).not.toContain('Cuarto')
  })

  it('encodes the sport in the expected JSON structure', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, sport: 'running', goal: 'ritmo', metrics: {} })
    expect(prompt).toContain('"sport": "running"')
  })

  it('uses the correct label for running sport', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, sport: 'running', goal: 'ritmo', metrics: {} })
    expect(prompt).toContain('running / carrera')
  })

  it('uses the correct label for fuerza sport', () => {
    const prompt = buildPrompt({ ...BASE_REQUEST, sport: 'fuerza', goal: 'hipertrofia', metrics: {} })
    expect(prompt).toContain('entrenamiento de fuerza en gimnasio')
  })

  it('falls back to the raw key for unknown sport', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompt = buildPrompt({ ...BASE_REQUEST, sport: 'triathlon' as any, metrics: {} })
    expect(prompt).toContain('triathlon')
  })

  it('falls back to the raw key for unknown goal', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompt = buildPrompt({ ...BASE_REQUEST, goal: 'unknown_goal' as any })
    expect(prompt).toContain('unknown_goal')
  })
})
