# Modelo de datos relacional — Préstamo de equipo del Laboratorio

**Equipo 0** · Sesión 7 · Actualizado 14-sep-2026

> Se consume en: [documento de análisis y diseño](./analisis-diseno.md) · Se compara con: [modelo de documentos](./modelo-documentos.md) · Decisión en: [decisión de motor](./decision-motor.md)

## Entidades

| Entidad | Campos | Nota |
| --- | --- | --- |
| `persona` | `id`, `nombre`, `matricula`, `tipo`, `correo` | Alumnos y profesores se tratan igual; los distingue `tipo` |
| `equipo` | `id`, `etiqueta`, `nombre`, `categoria_id` | Cada equipo tiene etiqueta física |
| `categoria` | `id`, `nombre` | |
| `prestamo` | `id`, `persona_id`, `admin_id`, `fecha_salida`, `dias_propuestos`, `dias_autorizados`, `fecha_compromiso`, `fecha_cierre` | Encabezado |
| `prestamo_equipo` | `prestamo_id`, `equipo_id`, `activo`, `dano`, `nota_dano` | Detalle N:M. El daño es por artículo |

> **`equipo.estado` se eliminó el 14-sep.** Ninguna historia lo escribía. La disponibilidad se deriva de `prestamo_equipo.activo`. Ver el hueco 1 en [análisis y diseño](./analisis-diseno.md).

## Reglas de negocio confirmadas con el cliente

1. Un préstamo puede incluir varios equipos.
2. Los préstamos **cierran completos**: no hay devoluciones parciales.
3. El prestatario propone una duración en días; el administrador puede ajustarla. Se guardan las dos.
4. El daño se registra **por artículo**, no por préstamo.
5. El administrador ve todos los préstamos; los demás solo los suyos.
6. No hay regla de autorización formal: es criterio del administrador en el momento.
7. El equipo **no** se vincula con materias. Se preguntó y el cliente lo descartó.

## Desnormalización deliberada

`prestamo_equipo.activo` es redundante (se deduce de `prestamo.fecha_cierre`). Existe para permitir:

```sql
CREATE UNIQUE INDEX equipo_un_solo_prestamo_activo
  ON prestamo_equipo (equipo_id)
  WHERE activo;
```

Eso hace cumplir el **RNF-4** en la base y no en el código.
