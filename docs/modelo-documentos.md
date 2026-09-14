# Modelo de documentos — el mismo sistema, sin tablas

**Equipo 0** · Sesión 8 · Actualizado 09-sep-2026

> Alternativa a: [modelo de datos relacional](./modelo-datos.md) · Decisión en: [decisión de motor](./decision-motor.md) · Se consume en: [análisis y diseño](./analisis-diseno.md)

## Forma propuesta

Dos colecciones: `personas` y `prestamos`. El detalle del préstamo se **embebe**, porque no se consulta nunca por separado y siempre se lee junto con su encabezado.

```json
{
  "_id": "pre_0412",
  "persona": { "id": "per_088", "nombre": "…", "matricula": "…", "tipo": "alumno" },
  "admin_id": "per_002",
  "fecha_salida": "2026-09-14T15:20:00Z",
  "dias_propuestos": 10,
  "dias_autorizados": 5,
  "fecha_compromiso": "2026-09-19",
  "fecha_cierre": null,
  "articulos": [
    { "equipo_id": "eq_117", "etiqueta": "OSC-03", "activo": true, "dano": false },
    { "equipo_id": "eq_045", "etiqueta": "MUL-11", "activo": true, "dano": false }
  ]
}
```

## Lo que gana

- Una sola lectura devuelve el préstamo completo. La pantalla de inventario no hace *joins*.
- Los datos de la persona quedan **congelados al momento del préstamo**, que es lo que un registro histórico quiere.

## Lo que pierde

- **La unicidad del equipo activo no se puede declarar.** No hay índice único parcial sobre un elemento de arreglo embebido en otro documento. El RNF-4 tendría que garantizarse en la capa de aplicación, con el riesgo de carrera que eso implica.
- La duplicación de los datos de persona obliga a decidir qué pasa cuando alguien cambia de correo.
