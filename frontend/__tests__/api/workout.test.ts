/**
 * @jest-environment node
 */
import { POST } from '@/app/api/workout/route'
import type { WorkoutRequest } from '@/types'

const MOCK_WORKOUT_RESPONSE = {
  sport: 'ciclismo',
  tipo: 'Intervalos al umbral',
  duracion: 60,
  intensidad: '90-95% FTP',
  instrucciones: 'Calienta 15 min y haz 4 series de 8 min al umbral.',
}

const VALID_BODY: WorkoutRequest = {
  sport: 'ciclismo',
  availableMinutes: 60,
  fatigueLevel: 'medio',
  goal: 'ftp',
  metrics: { fitnessLevel: 'intermedio', ftp: 250 },
  recentWorkouts: [],
}

const mockCreate = jest.fn()

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}))

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/workout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockCreate.mockResolvedValue({
    content: [{ type: 'text', text: JSON.stringify(MOCK_WORKOUT_RESPONSE) }],
  })
})

afterEach(() => {
  delete process.env.ANTHROPIC_API_KEY
  jest.clearAllMocks()
})

describe('POST /api/workout', () => {
  describe('when ANTHROPIC_API_KEY is missing', () => {
    it('returns 500 with a message mentioning ANTHROPIC_API_KEY', async () => {
      delete process.env.ANTHROPIC_API_KEY
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toContain('ANTHROPIC_API_KEY')
    })
  })

  describe('when ANTHROPIC_API_KEY is set', () => {
    beforeEach(() => {
      process.env.ANTHROPIC_API_KEY = 'test-key'
    })

    it('returns 200 with complete workout data', async () => {
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.tipo).toBe(MOCK_WORKOUT_RESPONSE.tipo)
      expect(data.duracion).toBe(MOCK_WORKOUT_RESPONSE.duracion)
      expect(data.intensidad).toBe(MOCK_WORKOUT_RESPONSE.intensidad)
      expect(data.instrucciones).toBe(MOCK_WORKOUT_RESPONSE.instrucciones)
    })

    it('returns the sport in the response', async () => {
      const res = await POST(makeRequest(VALID_BODY))
      const data = await res.json()
      expect(data.sport).toBe('ciclismo')
    })

    it('returns workout for running sport', async () => {
      const runningWorkout = { ...MOCK_WORKOUT_RESPONSE, sport: 'running' }
      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: JSON.stringify(runningWorkout) }],
      })
      const body: WorkoutRequest = { ...VALID_BODY, sport: 'running', goal: 'ritmo' }
      const res = await POST(makeRequest(body))
      const data = await res.json()
      expect(data.sport).toBe('running')
    })

    it('calls Anthropic with the provided API key', async () => {
      const Anthropic = jest.requireMock('@anthropic-ai/sdk').default
      await POST(makeRequest(VALID_BODY))
      expect(Anthropic).toHaveBeenCalledWith({ apiKey: 'test-key' })
    })

    it('returns 500 if Claude returns invalid JSON', async () => {
      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: 'no es json válido' }],
      })
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toBeDefined()
    })

    it('returns 500 with error message if Claude returns valid JSON missing required fields', async () => {
      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: JSON.stringify({ sport: 'ciclismo' }) }],
      })
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toContain('tipo')
    })

    it('returns 500 if response content is empty', async () => {
      mockCreate.mockResolvedValueOnce({ content: [] })
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(500)
    })

    it('returns 500 if Anthropic throws an Error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API unavailable'))
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toContain('API unavailable')
    })

    it('returns 500 with "Error desconocido" if a non-Error is thrown', async () => {
      mockCreate.mockRejectedValueOnce('string error')
      const res = await POST(makeRequest(VALID_BODY))
      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.error).toBe('Error desconocido')
    })
  })
})
