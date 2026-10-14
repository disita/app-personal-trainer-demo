import { render, screen } from '@testing-library/react'
import HistoryList from '@/components/HistoryList'
import type { WorkoutRecord } from '@/types'

const RECORDS: WorkoutRecord[] = [
  {
    date: '2026-04-14T10:00:00.000Z',
    sport: 'ciclismo',
    tipo: 'Intervalos',
    duracion: 60,
    intensidad: 'alta',
  },
  {
    date: '2026-04-13T10:00:00.000Z',
    sport: 'running',
    tipo: 'Rodada suave',
    duracion: 45,
    intensidad: 'baja',
  },
  {
    date: '2026-04-12T10:00:00.000Z',
    sport: 'fuerza',
    tipo: 'Sentadillas',
    duracion: 50,
    intensidad: 'media',
  },
]

describe('HistoryList', () => {
  describe('when empty', () => {
    it('shows the empty state message', () => {
      render(<HistoryList records={[]} />)
      expect(screen.getByText(/Sin entrenamientos registrados/)).toBeInTheDocument()
    })

    it('renders the section title', () => {
      render(<HistoryList records={[]} />)
      expect(screen.getByText(/Historial reciente/i)).toBeInTheDocument()
    })
  })

  describe('with records', () => {
    it('renders all workout names', () => {
      render(<HistoryList records={RECORDS} />)
      expect(screen.getByText('Intervalos')).toBeInTheDocument()
      expect(screen.getByText('Rodada suave')).toBeInTheDocument()
      expect(screen.getByText('Sentadillas')).toBeInTheDocument()
    })

    it('renders durations', () => {
      render(<HistoryList records={RECORDS} />)
      expect(screen.getByText(/60 min/)).toBeInTheDocument()
      expect(screen.getByText(/45 min/)).toBeInTheDocument()
    })

    it('renders intensities', () => {
      render(<HistoryList records={RECORDS} />)
      expect(screen.getByText('alta')).toBeInTheDocument()
      expect(screen.getByText('baja')).toBeInTheDocument()
    })

    it('shows cycling icon for ciclismo records', () => {
      render(<HistoryList records={[RECORDS[0]]} />)
      expect(screen.getByText('🚴')).toBeInTheDocument()
    })

    it('shows running icon for running records', () => {
      render(<HistoryList records={[RECORDS[1]]} />)
      expect(screen.getByText('🏃')).toBeInTheDocument()
    })

    it('shows strength icon for fuerza records', () => {
      render(<HistoryList records={[RECORDS[2]]} />)
      expect(screen.getByText('🏋️')).toBeInTheDocument()
    })

    it('shows fallback icon for records without sport', () => {
      const legacyRecord: WorkoutRecord = { date: '2026-01-01T00:00:00.000Z', tipo: 'Legacy', duracion: 30, intensidad: 'media' }
      render(<HistoryList records={[legacyRecord]} />)
      expect(screen.getByText('💪')).toBeInTheDocument()
    })

    it('does not show the empty state message', () => {
      render(<HistoryList records={RECORDS} />)
      expect(screen.queryByText(/Sin entrenamientos registrados/)).not.toBeInTheDocument()
    })
  })
})
