import Anthropic from '@anthropic-ai/sdk'
import type { WorkoutRequest, WorkoutResult } from '@/types'

const client = new Anthropic()

const FATIGUE_LABELS: Record<string, string> = {
  bajo: 'baja',
  medio: 'media',
  alto: 'alta',
}

const GOAL_LABELS: Record<string, string> = {
  ftp: 'mejorar FTP (potencia umbral)',
  resistencia: 'mejorar resistencia aeróbica',
  recuperacion: 'recuperación activa',
  fuerza: 'desarrollo de fuerza muscular',
}

function buildPrompt(req: WorkoutRequest): string {
  const recentSummary =
    req.recentWorkouts.length > 0
      ? req.recentWorkouts
          .slice(0, 3)
          .map((w) => `- ${w.tipo} (${w.duracion} min, ${w.intensidad})`)
          .join('\n')
      : 'Sin entrenamientos recientes registrados.'

  return `Eres un entrenador personal de ciclismo experto. Genera el entrenamiento del día para un ciclista con los siguientes datos:

- Tiempo disponible: ${req.availableMinutes} minutos
- Nivel de fatiga actual: ${FATIGUE_LABELS[req.fatigueLevel]}
- Objetivo: ${GOAL_LABELS[req.goal]}

Entrenamientos recientes:
${recentSummary}

Reglas:
- No encadenes sesiones duras consecutivas si la fatiga es alta
- Adapta el volumen e intensidad al tiempo disponible y la fatiga
- Si la fatiga es alta, prioriza recuperación o baja intensidad

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "tipo": "nombre del tipo de entrenamiento",
  "duracion": número de minutos (entero),
  "intensidad": "descripción de intensidad (ej: 65-75% FTP)",
  "instrucciones": "instrucciones detalladas del entrenamiento en 3-5 oraciones"
}`
}

export async function POST(request: Request) {
  const body: WorkoutRequest = await request.json()

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: buildPrompt(body) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const workout: WorkoutResult = JSON.parse(text)

  return Response.json(workout)
}
