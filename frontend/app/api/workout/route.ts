import Anthropic from '@anthropic-ai/sdk'
import type { WorkoutRequest, WorkoutResult } from '@/types'

const client = new Anthropic()

const FATIGUE_LABELS: Record<string, string> = {
  bajo: 'baja',
  medio: 'media',
  alto: 'alta',
}

const SPORT_LABELS: Record<string, string> = {
  ciclismo: 'ciclismo',
  running: 'running / carrera',
  fuerza: 'entrenamiento de fuerza en gimnasio',
}

const GOAL_LABELS: Record<string, string> = {
  ftp: 'mejorar FTP (potencia umbral)',
  resistencia: 'mejorar resistencia aeróbica',
  recuperacion: 'recuperación activa',
  velocidad: 'mejorar velocidad',
  ritmo: 'mejorar ritmo de carrera',
  volumen: 'aumentar volumen / fondo',
  hipertrofia: 'hipertrofia muscular',
  fuerza_max: 'fuerza máxima',
  resistencia_muscular: 'resistencia muscular',
}

function buildPrompt(req: WorkoutRequest): string {
  const recentSummary =
    req.recentWorkouts.length > 0
      ? req.recentWorkouts
          .slice(0, 3)
          .map((w) => `- ${w.tipo} (${w.duracion} min, ${w.intensidad})`)
          .join('\n')
      : 'Sin entrenamientos recientes registrados.'

  const metricsLines: string[] = []
  if (req.metrics.fitnessLevel) metricsLines.push(`- Nivel: ${req.metrics.fitnessLevel}`)
  if (req.metrics.ftp) metricsLines.push(`- FTP actual: ${req.metrics.ftp} W`)
  if (req.metrics.paceTarget) metricsLines.push(`- Ritmo objetivo: ${req.metrics.paceTarget} min/km`)
  const metricsSection = metricsLines.length > 0 ? metricsLines.join('\n') : '- Sin métricas registradas'

  return `Eres un entrenador personal experto en ${SPORT_LABELS[req.sport]}. Genera el entrenamiento del día con los siguientes datos del atleta:

- Deporte: ${SPORT_LABELS[req.sport]}
- Tiempo disponible: ${req.availableMinutes} minutos
- Nivel de fatiga actual: ${FATIGUE_LABELS[req.fatigueLevel]}
- Objetivo: ${GOAL_LABELS[req.goal]}

Métricas del atleta:
${metricsSection}

Entrenamientos recientes:
${recentSummary}

Reglas:
- No encadenes sesiones duras consecutivas si la fatiga es alta
- Adapta el volumen e intensidad al tiempo disponible y la fatiga
- Si la fatiga es alta, prioriza recuperación o baja intensidad
- Usa terminología específica del deporte (p.ej. zonas de potencia para ciclismo, series/reps para fuerza, pace para running)
- Si hay métricas, úsalas para personalizar la intensidad (ej. % del FTP, ritmo por km)

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta (sin markdown, sin texto extra):
{
  "sport": "${req.sport}",
  "tipo": "nombre del tipo de entrenamiento",
  "duracion": número de minutos (entero),
  "intensidad": "descripción concisa de intensidad",
  "instrucciones": "instrucciones detalladas del entrenamiento en 3-5 oraciones"
}`
}

export async function POST(request: Request) {
  try {
    const body: WorkoutRequest = await request.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const workout: WorkoutResult = JSON.parse(text)

    return Response.json(workout)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return Response.json({ error: message }, { status: 500 })
  }
}
