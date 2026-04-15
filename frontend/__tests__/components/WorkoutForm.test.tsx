import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkoutForm from '@/components/WorkoutForm'

function renderForm(onSubmit = jest.fn()) {
  return { onSubmit, ...render(<WorkoutForm onSubmit={onSubmit} loading={false} />) }
}

describe('WorkoutForm', () => {
  describe('initial render', () => {
    it('renders the sport selector with 3 options', () => {
      renderForm()
      expect(screen.getByText('Ciclismo')).toBeInTheDocument()
      expect(screen.getByText('Running')).toBeInTheDocument()
      expect(screen.getByText('Fuerza')).toBeInTheDocument()
    })

    it('renders time options', () => {
      renderForm()
      ;[30, 45, 60, 90, 120].forEach((t) => {
        expect(screen.getByText(`${t} min`)).toBeInTheDocument()
      })
    })

    it('renders fatigue options', () => {
      renderForm()
      expect(screen.getByText('Baja')).toBeInTheDocument()
      expect(screen.getByText('Media')).toBeInTheDocument()
      expect(screen.getByText('Alta')).toBeInTheDocument()
    })

    it('shows cycling goals by default', () => {
      renderForm()
      expect(screen.getByText('Mejorar FTP')).toBeInTheDocument()
    })

    it('shows the enabled submit button', () => {
      renderForm()
      const btn = screen.getByRole('button', { name: /Generar entrenamiento/i })
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
    })

    it('shows FTP input by default (ciclismo sport)', () => {
      renderForm()
      expect(screen.getByPlaceholderText('ej. 250')).toBeInTheDocument()
    })
  })

  describe('sport switching', () => {
    it('shows running goals when Running is selected', async () => {
      renderForm()
      await userEvent.click(screen.getByText('Running'))
      expect(screen.getByText('Mejorar ritmo')).toBeInTheDocument()
      expect(screen.queryByText('Mejorar FTP')).not.toBeInTheDocument()
    })

    it('shows strength goals when Fuerza is selected', async () => {
      renderForm()
      await userEvent.click(screen.getByText('Fuerza'))
      expect(screen.getByText('Hipertrofia')).toBeInTheDocument()
      expect(screen.queryByText('Mejorar FTP')).not.toBeInTheDocument()
    })

    it('shows pace input when Running is selected', async () => {
      renderForm()
      await userEvent.click(screen.getByText('Running'))
      expect(screen.getByPlaceholderText('ej. 5:30')).toBeInTheDocument()
    })

    it('hides FTP input when Running is selected', async () => {
      renderForm()
      await userEvent.click(screen.getByText('Running'))
      expect(screen.queryByPlaceholderText('ej. 250')).not.toBeInTheDocument()
    })

    it('hides both FTP and pace inputs for Fuerza', async () => {
      renderForm()
      await userEvent.click(screen.getByText('Fuerza'))
      expect(screen.queryByPlaceholderText('ej. 250')).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText('ej. 5:30')).not.toBeInTheDocument()
    })

    it('resets goal to first option of new sport when switching', async () => {
      const { onSubmit } = renderForm()
      // select a cycling goal first
      await userEvent.click(screen.getByText('Velocidad'))
      // switch to running — goal should reset
      await userEvent.click(screen.getByText('Running'))
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
      expect(onSubmit.mock.calls[0][0].goal).toBe('ritmo')
    })
  })

  describe('form submission', () => {
    it('calls onSubmit with concrete default values', async () => {
      const { onSubmit } = renderForm()
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      const args = onSubmit.mock.calls[0][0]
      expect(args.sport).toBe('ciclismo')
      expect(args.availableMinutes).toBe(60)
      expect(args.fatigueLevel).toBe('medio')
      expect(args.goal).toBe('resistencia')
      expect(args.metrics.fitnessLevel).toBe('intermedio')
    })

    it('submits selected time correctly', async () => {
      const { onSubmit } = renderForm()
      await userEvent.click(screen.getByText('90 min'))
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
      expect(onSubmit.mock.calls[0][0].availableMinutes).toBe(90)
    })

    it('submits selected fatigue correctly', async () => {
      const { onSubmit } = renderForm()
      await userEvent.click(screen.getByText('Alta'))
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
      expect(onSubmit.mock.calls[0][0].fatigueLevel).toBe('alto')
    })

    it('includes FTP in metrics when filled in', async () => {
      const { onSubmit } = renderForm()
      await userEvent.type(screen.getByPlaceholderText('ej. 250'), '280')
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
      expect(onSubmit.mock.calls[0][0].metrics.ftp).toBe(280)
    })

    it('omits ftp from metrics when FTP field contains non-numeric text', async () => {
      const { onSubmit } = renderForm()
      await userEvent.type(screen.getByPlaceholderText('ej. 250'), 'abc')
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
      expect(onSubmit.mock.calls[0][0].metrics.ftp).toBeUndefined()
    })

    it('includes paceTarget in metrics for running when filled in', async () => {
      const { onSubmit } = renderForm()
      await userEvent.click(screen.getByText('Running'))
      await userEvent.type(screen.getByPlaceholderText('ej. 5:30'), '5:45')
      fireEvent.click(screen.getByRole('button', { name: /Generar entrenamiento/i }))
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
      expect(onSubmit.mock.calls[0][0].metrics.paceTarget).toBe('5:45')
    })
  })

  describe('loading state', () => {
    it('disables the submit button when loading', () => {
      render(<WorkoutForm onSubmit={jest.fn()} loading={true} />)
      expect(screen.getByRole('button', { name: /Generando entrenamiento/i })).toBeDisabled()
    })

    it('shows "Generando entrenamiento..." text when loading', () => {
      render(<WorkoutForm onSubmit={jest.fn()} loading={true} />)
      expect(screen.getByText(/Generando entrenamiento/)).toBeInTheDocument()
    })
  })
})
