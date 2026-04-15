import { SPORT_ICONS } from '@/lib/constants'
import type { WorkoutResult } from '@/types'

interface Props {
  workout: WorkoutResult
}

export default function WorkoutCard({ workout }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{SPORT_ICONS[workout.sport] ?? '💪'}</span>
          <h2 className="text-xl font-bold text-gray-900">{workout.tipo}</h2>
        </div>
        <span className="shrink-0 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Guardado
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {workout.duracion} min
        </span>
        <span className="inline-flex items-center gap-1.5 bg-[#FC4C02] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {workout.intensidad}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Instrucciones</p>
        <p className="text-gray-700 leading-relaxed">{workout.instrucciones}</p>
      </div>
    </div>
  )
}
