'use client'

import { useState } from 'react'
import type { FatigueLevel, Goal, PerformanceMetrics, SportType, WorkoutRequest } from '@/types'

const TIME_OPTIONS = [30, 45, 60, 90, 120]

const SPORT_OPTIONS: { value: SportType; label: string; icon: string }[] = [
  { value: 'ciclismo', label: 'Ciclismo', icon: '🚴' },
  { value: 'running', label: 'Running', icon: '🏃' },
  { value: 'fuerza', label: 'Fuerza', icon: '🏋️' },
]

const GOALS_BY_SPORT: Record<SportType, { value: Goal; label: string }[]> = {
  ciclismo: [
    { value: 'ftp', label: 'Mejorar FTP' },
    { value: 'resistencia', label: 'Resistencia' },
    { value: 'velocidad', label: 'Velocidad' },
    { value: 'recuperacion', label: 'Recuperación' },
  ],
  running: [
    { value: 'ritmo', label: 'Mejorar ritmo' },
    { value: 'volumen', label: 'Fondo / volumen' },
    { value: 'velocidad', label: 'Velocidad' },
    { value: 'recuperacion', label: 'Recuperación' },
  ],
  fuerza: [
    { value: 'hipertrofia', label: 'Hipertrofia' },
    { value: 'fuerza_max', label: 'Fuerza máxima' },
    { value: 'resistencia_muscular', label: 'Resistencia muscular' },
    { value: 'recuperacion', label: 'Recuperación activa' },
  ],
}

const FATIGUE_OPTIONS: { value: FatigueLevel; label: string; color: string }[] = [
  { value: 'bajo', label: 'Baja', color: 'bg-green-500' },
  { value: 'medio', label: 'Media', color: 'bg-yellow-500' },
  { value: 'alto', label: 'Alta', color: 'bg-red-500' },
]

const FITNESS_LEVELS: { value: PerformanceMetrics['fitnessLevel']; label: string }[] = [
  { value: 'principiante', label: 'Principiante' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
]

interface Props {
  onSubmit: (req: Omit<WorkoutRequest, 'recentWorkouts'>) => void
  loading: boolean
}

export default function WorkoutForm({ onSubmit, loading }: Props) {
  const [sport, setSport] = useState<SportType>('ciclismo')
  const [minutes, setMinutes] = useState<number>(60)
  const [fatigue, setFatigue] = useState<FatigueLevel>('medio')
  const [goal, setGoal] = useState<Goal>('resistencia')
  const [ftp, setFtp] = useState<string>('')
  const [paceTarget, setPaceTarget] = useState<string>('')
  const [fitnessLevel, setFitnessLevel] = useState<PerformanceMetrics['fitnessLevel']>('intermedio')

  function handleSportChange(s: SportType) {
    setSport(s)
    setGoal(GOALS_BY_SPORT[s][0].value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const metrics: PerformanceMetrics = { fitnessLevel }
    if (ftp && !isNaN(Number(ftp))) metrics.ftp = Number(ftp)
    if (paceTarget.trim()) metrics.paceTarget = paceTarget.trim()
    onSubmit({ sport, availableMinutes: minutes, fatigueLevel: fatigue, goal, metrics })
  }

  const goals = GOALS_BY_SPORT[sport]

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

      {/* Sport */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Deporte
        </label>
        <div className="flex gap-2">
          {SPORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => handleSportChange(s.value)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                sport === s.value
                  ? 'bg-[#FC4C02] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Tiempo disponible
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMinutes(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                minutes === t
                  ? 'bg-[#FC4C02] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t} min
            </button>
          ))}
        </div>
      </div>

      {/* Fatigue */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Nivel de fatiga
        </label>
        <div className="flex gap-3">
          {FATIGUE_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFatigue(f.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                fatigue === f.value
                  ? 'bg-[#FC4C02] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${f.color}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Objetivo
        </label>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGoal(g.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                goal === g.value
                  ? 'bg-[#FC4C02] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Métricas (opcional)
        </label>
        <div className="space-y-3">
          {/* Fitness level */}
          <div className="flex gap-2">
            {FITNESS_LEVELS.map((fl) => (
              <button
                key={fl.value}
                type="button"
                onClick={() => setFitnessLevel(fl.value)}
                className={`flex-1 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                  fitnessLevel === fl.value
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {fl.label}
              </button>
            ))}
          </div>

          {/* FTP (ciclismo only) */}
          {sport === 'ciclismo' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 w-8">FTP</label>
              <input
                type="number"
                min={50}
                max={500}
                value={ftp}
                onChange={(e) => setFtp(e.target.value)}
                placeholder="ej. 250"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FC4C02]"
              />
              <span className="text-sm text-gray-400">W</span>
            </div>
          )}

          {/* Pace target (running only) */}
          {sport === 'running' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 w-20">Ritmo obj.</label>
              <input
                type="text"
                value={paceTarget}
                onChange={(e) => setPaceTarget(e.target.value)}
                placeholder="ej. 5:30"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FC4C02]"
              />
              <span className="text-sm text-gray-400">min/km</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FC4C02] hover:bg-[#e04402] text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
      >
        {loading ? 'Generando entrenamiento...' : 'Generar entrenamiento del día'}
      </button>
    </form>
  )
}
