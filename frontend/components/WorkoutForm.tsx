'use client'

import { useState } from 'react'
import type { FatigueLevel, Goal, WorkoutRequest } from '@/types'

const TIME_OPTIONS = [30, 45, 60, 90, 120]

const FATIGUE_OPTIONS: { value: FatigueLevel; label: string; color: string }[] = [
  { value: 'bajo', label: 'Baja', color: 'bg-green-500' },
  { value: 'medio', label: 'Media', color: 'bg-yellow-500' },
  { value: 'alto', label: 'Alta', color: 'bg-red-500' },
]

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'ftp', label: 'Mejorar FTP' },
  { value: 'resistencia', label: 'Resistencia' },
  { value: 'recuperacion', label: 'Recuperación' },
  { value: 'fuerza', label: 'Fuerza' },
]

interface Props {
  recentWorkoutsCount: number
  onSubmit: (req: Omit<WorkoutRequest, 'recentWorkouts'>) => void
  loading: boolean
}

export default function WorkoutForm({ recentWorkoutsCount, onSubmit, loading }: Props) {
  const [minutes, setMinutes] = useState<number>(60)
  const [fatigue, setFatigue] = useState<FatigueLevel>('medio')
  const [goal, setGoal] = useState<Goal>('resistencia')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ availableMinutes: minutes, fatigueLevel: fatigue, goal })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
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
          {GOAL_OPTIONS.map((g) => (
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
