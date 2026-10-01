# Clase-DS_O26-lab-prestamos

Caso de ejemplo del curso **Diseño de Software** (LIIS1208) — Ingeniería en Sistemas Computacionales, IBERO Puebla, Otoño 2026.

Documentación de análisis y diseño del sistema de préstamo de equipo del Laboratorio, escrita por un "Equipo 0" como referencia de la Sesión 9.

## Estructura

Toda la documentación vive en `docs/`, como cinco notas enlazadas entre sí:

| Archivo | Qué es |
| --- | --- |
| `docs/analisis-diseno.md` | Documento integrador de ocho secciones |
| `docs/backlog.md` | Historias con criterios de aceptación, MoSCoW y RNF |
| `docs/modelo-datos.md` | Entidades, campos y reglas de negocio |
| `docs/modelo-documentos.md` | La alternativa en documentos |
| `docs/decision-motor.md` | La decisión de motor y su justificación |

## Aplicación (React + Vite)

El prototipo vive en `src/`: un catálogo de equipos con búsqueda y filtro de disponibles.

```bash
npm install
npm run dev
```

| Ruta | Qué es |
| --- | --- |
| `src/App.jsx` | Componente raíz |
| `src/components/Catalogo.jsx` | Estado de búsqueda y filtro; valores derivados |
| `src/components/TarjetaEquipo.jsx` | Tarjeta de un equipo (recibe props) |
| `src/data/equipos.js` | Datos de ejemplo |

## Cómo leer la documentación

Abrir la carpeta `docs/` como vault en Obsidian (no la raíz del repositorio) y activar el **modo lectura**. Los enlaces son relativos en Markdown estándar, así que funcionan también en GitHub y en VS Code.

---

Mtro. Rafael Pérez Aguirre · IBERO Puebla

