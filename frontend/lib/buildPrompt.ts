import type { WorkoutRequest } from '@/types'

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

export function buildPrompt(req: WorkoutRequest): string {
  const sport = SPORT_LABELS[req.sport] ?? req.sport
  const fatigue = FATIGUE_LABELS[req.fatigueLevel] ?? req.fatigueLevel
  const goal = GOAL_LABELS[req.goal] ?? req.goal

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

  return `Eres un entrenador personal experto en ${sport}. Genera el entrenamiento del día con los siguientes datos del atleta:

- Deporte: ${sport}
- Tiempo disponible: ${req.availableMinutes} minutos
- Nivel de fatiga actual: ${fatigue}
- Objetivo: ${goal}

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
