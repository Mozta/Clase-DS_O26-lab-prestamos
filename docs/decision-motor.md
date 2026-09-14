# Decisión de motor — PostgreSQL

**Equipo 0** · Sesión 8 · Actualizado 09-sep-2026

> Compara: [modelo relacional](./modelo-datos.md) vs. [modelo de documentos](./modelo-documentos.md) · Se consume en: [análisis y diseño](./analisis-diseno.md)

## 1. Qué se decide

Qué motor guarda los datos del sistema de préstamo: PostgreSQL (relacional) o Firestore / MongoDB (documentos).

## 2. Criterios de decisión

| Criterio | Peso | Por qué |
| --- | --- | --- |
| Garantizar el RNF-4 sin código | Alto | Es la regla que más duele si falla: dos personas con el mismo equipo |
| Consultas por equipo y por persona | Medio | Las dos direcciones se usan a diario |
| Volumen esperado | Bajo | Cientos de préstamos por semestre. Ningún motor sufre |
| Lo que el equipo sabe operar | Medio | Semestre de 16 semanas |

## 3. Decisión

**PostgreSQL.**

## 4. Razón principal

El índice único parcial `UNIQUE (equipo_id) WHERE activo` hace cumplir el RNF-4 **en la base**. En documentos, esa misma regla vive en la aplicación y se rompe con dos peticiones simultáneas.

## 5. La regla que el motor NO garantiza

*"Un préstamo cierra completo: no hay devoluciones parciales."*

PostgreSQL no tiene forma declarativa de exigir que todos los renglones del detalle se cierren juntos. Se garantiza con una transacción en la capa de aplicación, o con un *trigger*. **Queda escrito porque la base va a aceptar sin protestar un renglón cerrado suelto.**

## 6. Qué haría cambiar esta decisión

Que el sistema tuviera que funcionar sin conexión en el mostrador, o que el catálogo de equipo se volviera heterogéneo (cada categoría con atributos propios). Ninguna de las dos está en el alcance.
