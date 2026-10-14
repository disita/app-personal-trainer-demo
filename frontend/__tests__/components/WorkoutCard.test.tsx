import { render, screen } from '@testing-library/react'
import WorkoutCard from '@/components/WorkoutCard'
import type { WorkoutResult } from '@/types'

const CYCLING_WORKOUT: WorkoutResult = {
  sport: 'ciclismo',
  tipo: 'Intervalos al umbral',
  duracion: 60,
  intensidad: '90-95% FTP',
  instrucciones: 'Calienta 15 min, luego 4x8 min al umbral.',
}

const RUNNING_WORKOUT: WorkoutResult = {
  sport: 'running',
  tipo: 'Rodada a ritmo',
  duracion: 45,
  intensidad: '5:30 min/km',
  instrucciones: 'Mantén el ritmo objetivo de forma constante.',
}

const STRENGTH_WORKOUT: WorkoutResult = {
  sport: 'fuerza',
  tipo: 'Sentadillas y peso muerto',
  duracion: 50,
  intensidad: '75% 1RM',
  instrucciones: 'Trabaja las cadenas musculares principales.',
}

describe('WorkoutCard', () => {
  it('renders the workout tipo', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText('Intervalos al umbral')).toBeInTheDocument()
  })

  it('renders the duration', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText(/60 min/)).toBeInTheDocument()
  })

  it('renders the intensity', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText('90-95% FTP')).toBeInTheDocument()
  })

  it('renders the instrucciones', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText(/Calienta 15 min/)).toBeInTheDocument()
  })

  it('shows the cycling sport icon', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText('🚴')).toBeInTheDocument()
  })

  it('shows the running sport icon', () => {
    render(<WorkoutCard workout={RUNNING_WORKOUT} />)
    expect(screen.getByText('🏃')).toBeInTheDocument()
  })

  it('shows the strength sport icon', () => {
    render(<WorkoutCard workout={STRENGTH_WORKOUT} />)
    expect(screen.getByText('🏋️')).toBeInTheDocument()
  })

  it('shows the "Guardado" badge', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText('Guardado')).toBeInTheDocument()
  })

  it('renders the "Instrucciones" section label', () => {
    render(<WorkoutCard workout={CYCLING_WORKOUT} />)
    expect(screen.getByText('Instrucciones')).toBeInTheDocument()
  })
})
