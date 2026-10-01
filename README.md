# Clase-DS_O26-lab-prestamos

Caso ejemplo del curso **Diseño de Software** (LIIS1208) — Ingeniería en Sistemas Computacionales, IBERO Puebla, Otoño 2026.

Sistema de préstamo de equipo del Laboratorio. El repositorio reúne dos cosas:

- **Documentación de análisis y diseño** (`docs/`), referencia de la Sesión 9.
- **Prototipo en React** (`src/`), construido en clase a partir de la introducción a React.

## Estructura

```
├── docs/              Documentación de análisis y diseño
├── src/
│   ├── App.jsx        Componente raíz
│   ├── components/    Componentes de la interfaz
│   └── data/          Datos de ejemplo
├── public/            Archivos estáticos (favicon)
└── index.html         Punto de entrada de Vite
```

## Documentación

Cinco notas enlazadas entre sí:

| Archivo | Qué es |
| --- | --- |
| `docs/analisis-diseno.md` | Documento integrador de ocho secciones |
| `docs/backlog.md` | Historias con criterios de aceptación, MoSCoW y RNF |
| `docs/modelo-datos.md` | Entidades, campos y reglas de negocio |
| `docs/modelo-documentos.md` | La alternativa en documentos |
| `docs/decision-motor.md` | La decisión de motor y su justificación |

Para leerla, abrir la carpeta `docs/` como vault en Obsidian (no la raíz del repositorio) y activar el **modo lectura**. Los enlaces son relativos en Markdown estándar, así que funcionan también en GitHub y en VS Code.

## Prototipo en React

Catálogo de equipos del Laboratorio con búsqueda por nombre y filtro de equipos disponibles.

### Requisitos

- Node.js 20.19 o superior (o 22.12+)

### Cómo correrlo

```bash
npm install
npm run dev
```

Abrir la URL que muestra la terminal (por defecto `http://localhost:5173`).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente lo generado en `dist/` |
| `npm run lint` | Revisa el código con ESLint |

### Componentes

| Archivo | Qué es |
| --- | --- |
| `src/App.jsx` | Componente raíz: encabezado y catálogo |
| `src/components/Catalogo.jsx` | Estado de búsqueda y filtro; valores derivados |
| `src/components/TarjetaEquipo.jsx` | Tarjeta de un equipo (recibe props) |
| `src/data/equipos.js` | Datos de ejemplo |

### Conceptos que muestra

- Componentes y **props** (`App` → `Catalogo` → `TarjetaEquipo`)
- Estado local con **`useState`** e **inputs controlados**
- **Valores derivados**: se calculan en cada render en lugar de guardarse en el estado
- Listas con `map` y `key`, y render condicional

### Pendiente

- El botón **Solicitar** todavía no registra el préstamo (historias #03 y #07 del [backlog](./docs/backlog.md)).
- Los datos de ejemplo guardan `disponible` como campo; en el [modelo de datos](./docs/modelo-datos.md) la disponibilidad se deriva de los préstamos activos.

---

Mtro. Rafael Pérez Aguirre · IBERO Puebla
