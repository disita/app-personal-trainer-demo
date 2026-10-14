# app-personal-trainer-demo

Entrenador personal con IA que genera el entrenamiento del día para ciclismo, running o fuerza, adaptado a tu fatiga, tiempo disponible, objetivo y actividad reciente. Todas las respuestas son en español.

## Requisitos
- Node.js 20.9 o superior
- Una API key de Anthropic

## Instalación y uso
```bash
cd frontend
npm install
cp .env.local.example .env.local   # añade tu ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000
```

## Tests
```bash
cd frontend
npm test
```

## Documentación
- Especificación funcional: [docs/instructions.md](docs/instructions.md)

## Licencia
Ver [LICENSE](LICENSE).
