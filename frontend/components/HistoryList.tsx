import type { WorkoutRecord } from '@/types'

interface Props {
  records: WorkoutRecord[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function HistoryList({ records }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Historial reciente
      </h3>

      {records.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          Sin entrenamientos registrados todavía.
        </p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {records.map((r, i) => (
            <li key={i} className="flex items-center justify-between py-3 gap-4">
              <span className="text-xs text-gray-400 w-20 shrink-0">{formatDate(r.date)}</span>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{r.tipo}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500">{r.duracion} min</span>
                <span className="text-xs bg-orange-50 text-[#FC4C02] font-semibold px-2 py-0.5 rounded-full">
                  {r.intensidad}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
