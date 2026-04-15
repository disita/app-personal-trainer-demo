'use client'

import { useState, useEffect } from 'react'
import WorkoutForm from '@/components/WorkoutForm'
import WorkoutCard from '@/components/WorkoutCard'
import HistoryList from '@/components/HistoryList'
import { getHistory, saveWorkout } from '@/lib/history'
import type { WorkoutRequest, WorkoutResult, WorkoutRecord } from '@/types'

export default function Home() {
  const [workout, setWorkout] = useState<WorkoutResult | null>(null)
  const [history, setHistory] = useState<WorkoutRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  async function handleGenerate(inputs: Omit<WorkoutRequest, 'recentWorkouts'>) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inputs, recentWorkouts: history }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al generar el entrenamiento')
      const result: WorkoutResult = data
      setWorkout(result)
      saveWorkout(result)
      setHistory(getHistory())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar el entrenamiento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FC4C02] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">Entrenador Personal IA</h1>
            <p className="text-xs text-gray-400">Ciclismo · Running · Fuerza</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <WorkoutForm onSubmit={handleGenerate} loading={loading} />

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {workout && <WorkoutCard workout={workout} />}

        <HistoryList records={history} />
      </div>
    </main>
  )
}
