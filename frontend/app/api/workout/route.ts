import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/buildPrompt'
import type { WorkoutRequest, WorkoutResult } from '@/types'

function parseWorkout(text: string): WorkoutResult {
  const data = JSON.parse(text)
  const required = ['sport', 'tipo', 'duracion', 'intensidad', 'instrucciones'] as const
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Respuesta incompleta del modelo: falta el campo "${field}"`)
    }
  }
  return data as WorkoutResult
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      {
        error:
          'ANTHROPIC_API_KEY no está configurada. Crea el archivo frontend/.env.local con: ANTHROPIC_API_KEY=sk-ant-...',
      },
      { status: 500 }
    )
  }

  try {
    const body: WorkoutRequest = await request.json()
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    })

    const firstBlock = message.content[0]
    if (!firstBlock || firstBlock.type !== 'text') {
      throw new Error('El modelo no devolvió una respuesta de texto')
    }

    const workout = parseWorkout(firstBlock.text)
    return Response.json(workout)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return Response.json({ error: message }, { status: 500 })
  }
}
