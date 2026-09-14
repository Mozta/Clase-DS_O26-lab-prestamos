# Backlog — Sistema de préstamo de equipo del Laboratorio

**Equipo 0** · Sesiones 5 y 6 · Actualizado 14-sep-2026

> Se consume en: [documento de análisis y diseño](./analisis-diseno.md)

## Historias de usuario priorizadas (MoSCoW)

### Must have

**#03 — Registrar un préstamo de uno o varios equipos**
Como administrador del laboratorio, quiero registrar qué equipos se lleva una persona y por cuántos días, para saber en cualquier momento dónde está cada equipo.

- Dado un equipo disponible, cuando registro el préstamo, entonces queda con fecha de compromiso.
- Dado un préstamo de 3 equipos, cuando lo registro, entonces los 3 quedan en el mismo préstamo.
- Dado un equipo ya prestado, cuando intento prestarlo otra vez, entonces el sistema lo rechaza.

**#05 — Consultar qué está prestado ahora mismo**
Como administrador, quiero ver la lista de equipos prestados, para responder sin buscar en la libreta.

- Dado un equipo prestado, cuando abro el inventario, entonces aparece como no disponible.
- Dado que soy prestatario, cuando abro el inventario, entonces solo veo mis préstamos.

**#07 — Registrar la devolución completa de un préstamo**
Como administrador, quiero cerrar un préstamo cuando vuelve el equipo, para que deje de contar como prestado.

- Dado un préstamo abierto, cuando registro la devolución, entonces se cierra completo.
- Dado un préstamo de varios equipos, cuando lo cierro, entonces se cierran todos los renglones.

**#08 — Reservar un equipo con anticipación**
Como alumno, quiero apartar un equipo para una fecha futura, para asegurarme de que esté disponible el día de mi práctica.

- Dado un equipo libre el jueves, cuando reservo, entonces queda apartado.
- Dada una reserva vencida, cuando pasa la fecha, entonces el equipo se libera.

**#12 — Registrar daño de un equipo al devolverlo**
Como administrador, quiero anotar el daño del artículo específico, para saber qué equipo necesita reparación y quién lo tenía.

- Dado un equipo devuelto con golpe, cuando registro la devolución, entonces el daño queda en ese artículo.

### Should have

**#14 — Ver el historial de préstamos de una persona**
- Dado un alumno con préstamos previos, cuando abro su ficha, entonces veo la lista completa.
- Dada una persona sin préstamos, cuando abro su ficha, entonces se ve un estado vacío claro.

**#16 — Ajustar la duración que propuso el prestatario**
- Dado que el prestatario propuso 10 días, cuando autorizo 5, entonces quedan registrados los dos.

### Could have

**#19 — Ver quién devuelve tarde con frecuencia**
- Dado un alumno con devoluciones tardías, cuando abro su ficha, entonces veo cuántas veces devolvió tarde.

### Won't have (este semestre)

**#21 — Bloquear automáticamente a quien acumule retrasos.**
Justificación: el cliente fue explícito en la entrevista — no existe regla de autorización formal, el administrador usa su criterio en el momento. Automatizar la sanción sería inventar una política que la institución no tiene.

## Requerimientos no funcionales

| RNF | Enunciado | Cómo se verifica |
| --- | --- | --- |
| RNF-1 | La consulta de "qué está prestado ahora" responde en menos de 2 s con 500 préstamos activos | Medición con base sembrada |
| RNF-2 | Un prestatario solo lee sus propios préstamos; el administrador los ve todos | Prueba con dos cuentas |
| RNF-3 | Registrar un préstamo de 3 equipos toma 6 interacciones o menos | Conteo de clics sobre el flujo |
| RNF-4 | Un equipo no puede estar en dos préstamos activos al mismo tiempo | Intento de doble registro devuelve error |

> **RNF-3 se reescribió el 14-sep.** Estaba como "el sistema debe ser fácil de usar" — sin forma de verificación. Ver el hueco 2 en [análisis y diseño](./analisis-diseno.md).
