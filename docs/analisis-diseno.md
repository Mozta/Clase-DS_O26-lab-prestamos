# Documento de análisis y diseño — Sistema de préstamo de equipo del Laboratorio

**Equipo 0** · Integrantes: (ejemplo del profesor) · Fecha: 14-sep-2026 · Repositorio: `Clase-DS_O26-lab-prestamos` · Rama: `docs/analisis-diseno`

> Documentos de los que depende este: [backlog](./backlog.md) · [modelo de datos](./modelo-datos.md) · [modelo de documentos](./modelo-documentos.md) · [decisión de motor](./decision-motor.md)

---

## 1. El sistema en una página

**Qué problema resuelve.** El laboratorio presta equipo —multímetros, osciloscopios, kits de desarrollo, cámaras— a alumnos y profesores. Hoy el registro se lleva en una libreta en el mostrador. Como consecuencia: nadie puede responder en el momento qué está prestado y a quién, no hay forma de saber quién tenía un equipo que volvió dañado, y el administrador descubre los retrasos hasta que alguien pregunta por un equipo que no aparece.

**Para quién.** El usuario principal es el **administrador del laboratorio**, que es quien registra, autoriza y recibe. Los **prestatarios** —alumnos y profesores, tratados igual— consultan lo suyo y solicitan.

**Qué NO va a hacer** (tomado del *Won't have* del [backlog](./backlog.md)):

- **No hace reservas con anticipación.** El préstamo se registra en el momento, en el mostrador, con el equipo enfrente.
- **No aplica sanciones automáticas** por retraso. El administrador decide caso por caso, que es como opera hoy.
- **No lleva inventario de consumibles** (cables, resistencias, baterías). Solo equipo con etiqueta.
- **No se conecta con el sistema escolar.** La lista de personas se carga a mano.

---

## 2. Qué hace — backlog priorizado

Backlog completo: [`docs/backlog.md`](./backlog.md) · *Aquí solo va el resumen. El backlog no se copia, se enlaza.*

| Prioridad | # | Historia | Criterios de aceptación |
| --- | --- | --- | --- |
| **Must** | #03 | Registrar un préstamo de uno o varios equipos | 3 |
| **Must** | #05 | Consultar qué está prestado ahora mismo | 2 |
| **Must** | #07 | Registrar la devolución completa de un préstamo | 2 |
| **Must** | #08 | Reservar un equipo con anticipación | 2 |
| **Must** | #12 | Registrar daño de un equipo al devolverlo | 1 |
| **Should** | #14 | Ver el historial de préstamos de una persona | 2 |
| **Should** | #16 | Ajustar la duración que propuso el prestatario | 1 |
| **Could** | #19 | Ver quién devuelve tarde con frecuencia | 1 |
| **Won't** | #21 | Bloquear automáticamente a quien acumule retrasos | — |

**Won't have justificado.** #21 se dejó fuera porque el cliente fue explícito: no existe una regla de autorización formal, el administrador usa su criterio en el momento. Automatizar una sanción sería inventar una política que la institución no tiene.

**Requerimientos no funcionales** (4, todos con forma de verificación):

| RNF | Enunciado | Cómo se verifica |
| --- | --- | --- |
| **RNF-1** | La consulta de "qué está prestado ahora" responde en menos de 2 s con 500 préstamos activos | Medición con base sembrada de 500 registros |
| **RNF-2** | Un prestatario solo puede leer sus propios préstamos; el administrador los ve todos | Prueba con dos cuentas: la del alumno no devuelve registros ajenos |
| **RNF-3** | Registrar un préstamo de 3 equipos toma 6 interacciones o menos | Conteo de clics y capturas sobre el flujo completo |
| **RNF-4** | Un equipo no puede estar en dos préstamos activos al mismo tiempo | Intento de doble registro: el sistema devuelve error, no lo acepta |

---

## 3. Qué guarda — modelo de datos y motor

**Forma de datos elegida:** relacional. **Motor:** PostgreSQL.
Detalle en [modelo de datos](./modelo-datos.md), [modelo de documentos](./modelo-documentos.md) y [decisión de motor](./decision-motor.md).

**Cuatro entidades.** `prestamo` es el encabezado y `prestamo_equipo` el detalle, porque un préstamo puede llevar varios equipos y el daño se registra por artículo, no por préstamo.

| Entidad | Campos |
| --- | --- |
| `persona` | `id`, `nombre`, `matricula`, `tipo` (alumno / profesor), `correo` |
| `equipo` | `id`, `etiqueta`, `nombre`, `categoria_id`, `estado` |
| `prestamo` | `id`, `persona_id`, `admin_id`, `fecha_salida`, `dias_propuestos`, `dias_autorizados`, `fecha_compromiso`, `fecha_cierre` |
| `prestamo_equipo` | `prestamo_id`, `equipo_id`, `activo`, `dano`, `nota_dano` |

**Una desnormalización deliberada.** `prestamo_equipo.activo` es un booleano redundante: se podría deducir de `prestamo.fecha_cierre`. Está ahí porque permite un **índice único parcial** —`UNIQUE (equipo_id) WHERE activo`— que es lo que hace cumplir el RNF-4 en la base y no en el código. Es una decisión, no un descuido, y por eso está escrita.

**La regla que el motor NO garantiza.** *"Un préstamo cierra completo: no hay devoluciones parciales."* PostgreSQL no tiene forma declarativa de exigir que todos los renglones del detalle se cierren juntos. Se garantiza en una transacción en la capa de aplicación. **Queda escrito aquí porque el día que alguien cierre un renglón suelto, la base lo va a aceptar sin protestar.**

---

## 4. Matriz de trazabilidad

Una fila **por criterio de aceptación**. La columna *Lee / Escribe* dice qué hace el criterio con el dato: si un campo solo se lee y ninguna historia lo escribe, alguien tiene que llenarlo y nadie lo está haciendo.

| Historia | Criterio de aceptación | Entidad.campo | Lee / Escribe | RNF | Hueco |
| --- | --- | --- | --- | --- | --- |
| #03 | Dado un equipo disponible, cuando registro el préstamo, entonces queda con fecha de compromiso | `prestamo.fecha_salida`, `.dias_autorizados`, `.fecha_compromiso` | Escribe | — | — |
| #03 | Dado un préstamo de 3 equipos, cuando lo registro, entonces los 3 quedan en el mismo préstamo | `prestamo_equipo.prestamo_id`, `.equipo_id`, `.activo` | Escribe | RNF-4 | — |
| #03 | Dado un equipo ya prestado, cuando intento prestarlo otra vez, entonces el sistema lo rechaza | `prestamo_equipo.activo` | Lee | RNF-4 | — |
| #05 | Dado un equipo prestado, cuando abro el inventario, entonces aparece como no disponible | `prestamo_equipo.activo`, `equipo.etiqueta` | Lee | RNF-1 | — |
| #05 | Dado que soy prestatario, cuando abro el inventario, entonces solo veo mis préstamos | `prestamo.persona_id` | Lee | RNF-2 | — |
| #07 | Dado un préstamo abierto, cuando registro la devolución, entonces se cierra completo | `prestamo.fecha_cierre`, `prestamo_equipo.activo` | Escribe | — | — |
| #12 | Dado un equipo devuelto con golpe, cuando registro la devolución, entonces el daño queda en ese artículo | `prestamo_equipo.dano`, `.nota_dano` | Escribe | — | — |
| #14 | varios | `persona.*`, `prestamo.*` | Lee | — | — |
| #16 | Dado que el prestatario propuso 10 días, cuando autorizo 5, entonces quedan registrados los dos | `prestamo.dias_propuestos`, `.dias_autorizados` | Escribe | — | — |
| #19 | Dado un alumno con devoluciones tardías, cuando abro su ficha, entonces veo cuántas veces devolvió tarde | `prestamo.fecha_devolucion_real` | Lee | — | — |
| *(lectura hacia atrás)* | ¿Qué historia escribe `equipo.estado`? | `equipo.estado` | **Nadie** | — | **2** |
| *(lectura hacia atrás)* | ¿Qué historia pide saber quién autorizó? | `prestamo.admin_id` | **Nadie** | — | **2** |

**Cobertura:** 5 historias *Must* y 2 *Should*. Las *Could* se dejaron fuera a propósito: trazar lo que no entra al alcance es trabajo que se tira.

---

## 5. Huecos detectados y qué hicimos con ellos

**Hueco 1 — `equipo.estado` no lo escribe nadie. Tipo 2 (dato sin dueño).**
El campo se lee en #05 para mostrar disponibilidad, pero ninguna historia lo actualiza. Se descubrió leyendo el [modelo de datos](./modelo-datos.md) hacia atrás.
**Qué hicimos:** se eliminó el campo. La disponibilidad se deriva de `prestamo_equipo.activo`, que sí tiene quién lo escriba (#03 y #07). Commit `a1f9c02`, issue **#31** cerrado.
**Por qué así y no agregando una historia:** agregar una historia para mantener un campo que ya se puede deducir es inventar trabajo. La regla que usamos: si el dato se puede derivar, se deriva.

**Hueco 2 — RNF-3 no era verificable. Tipo 4 (RNF sin forma de verificación).**
Estaba escrito como *"el sistema debe ser fácil de usar"*. Eso no es un requerimiento, es un deseo: no hay forma de decir si se cumplió.
**Qué hicimos:** se reescribió como *"registrar un préstamo de 3 equipos toma 6 interacciones o menos"*, con conteo de clics como verificación. Issue **#28**.

**Hueco 3 — `prestamo.admin_id` no lo pide ninguna historia. Tipo 2.**
Aparece en la matriz como fila sin dueño. **No lo resolvimos**: queda abierto, porque hay que preguntarle al cliente si necesita saber quién autorizó cada préstamo. Issue **#33** abierto, etiquetado `pregunta-cliente`. Está también en la sección 7.

---

## 6. Inventario de pantallas — qué se ve

**No se dibujan hoy.** Se enumeran, porque cada criterio de aceptación de la matriz implica una pantalla, y la lista sale de la matriz sin inventar nada.

| Pantalla | Historias que realiza | Estado que hay que contemplar |
| --- | --- | --- |
| Inventario — "qué está prestado ahora" | #05 | Lista vacía · equipo disponible / prestado |
| Registro de préstamo (mostrador) | #03, #16 | Equipo ya prestado (error) · varios equipos en un préstamo |
| Devolución | #07, #12 | Devolución con daño · devolución sin daño |
| Ficha de persona | #14 | Persona sin préstamos |
| Acceso | — (RNF-2) | Administrador vs. prestatario |

---

## 7. Decisiones abiertas

| Qué falta decidir | Quién decide | Qué bloquea |
| --- | --- | --- |
| Método de acceso (correo institucional, usuario propio, otra cosa) | El cliente | RNF-2 y el arranque del MVP |
| Si se registra quién autorizó cada préstamo (`prestamo.admin_id`) | El cliente | Cierra el hueco 3 |
| Quién administra las categorías de equipo: existe `categoria_id` y ninguna historia las crea ni edita | El equipo, con el cliente | Posible hueco tipo 2 sin confirmar |

---

## 8. Declaración de uso de IA generativa

| Herramienta | Qué se pidió | Qué se aceptó | Qué se rechazó y por qué |
| --- | --- | --- | --- |
| Claude (Sonnet) | Generar la matriz de trazabilidad a partir de [backlog](./backlog.md) y [modelo de datos](./modelo-datos.md) | La estructura de columnas y el formato Dado/Cuando/Entonces abreviado | **Llenó las 14 filas sin un solo hueco.** Para que la fila de #19 cerrara, se inventó el campo `prestamo.fecha_devolucion_real`, que no existe en nuestro modelo. Se rechazó el campo: el hueco es el hallazgo, no el problema |
| Claude (Sonnet) | Redactar la sección 1 a partir de la entrevista con el cliente | El planteamiento del problema, reescrito | La frase "sistema robusto y escalable": no significa nada verificable y no sale de la entrevista |

**Lo que la herramienta no vio y nosotros sí:** los dos huecos de tipo 2 (`equipo.estado` y `prestamo.admin_id`). Los dos se encuentran leyendo el modelo hacia atrás, preguntando quién escribe cada campo, y eso la herramienta no lo hizo ni cuando se le pidió: siguió proponiendo historias nuevas para justificar los campos en vez de señalar que sobraban.
