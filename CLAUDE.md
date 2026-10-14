# CLAUDE.md

## Proyecto
Entrenador personal con IA que genera el entrenamiento del día (ciclismo, running o fuerza) según fatiga, tiempo disponible, objetivo e historial reciente. La especificación funcional está en `docs/instructions.md`.

## Estructura
- `frontend/`: app Next.js 16 (App Router, React 19, Tailwind 4, TypeScript) con la API route `app/api/workout/route.ts`, que llama a Claude mediante `@anthropic-ai/sdk`.
- `backend/`, `scripts/`, `tests/`: reservados, vacíos por ahora.
- `docs/`: especificación y documentación.

## Cómo ejecutar
```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm test         # Jest + Testing Library
npm run lint
```

## Convenciones
- Todo el contenido visible para el usuario y las respuestas del modelo van en español.
- La API key va en `frontend/.env.local` (`ANTHROPIC_API_KEY`); la plantilla está en `frontend/.env.local.example`. Nunca se versiona.
- Next.js: seguir `frontend/AGENTS.md` (consultar la documentación de `node_modules/next/dist/docs/` antes de escribir código).
