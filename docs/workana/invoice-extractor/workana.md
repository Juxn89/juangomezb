# Ficha Workana · `invoice-extractor`

> Ficha para el portafolio de Workana. Escrita el 22 oct 2026 a partir del README, los ADR y los resultados
> de evaluación del repo ([github.com/Juxn89/invoice-extractor](https://github.com/Juxn89/invoice-extractor)).
> El plan del proyecto está en [`plan.md`](plan.md), en esta misma carpeta.
>
> **Antes de publicar:** revisar en el formulario de Workana el límite de caracteres de cada campo y los
> nombres exactos de las habilidades. El video y las capturas salen de la app real, con Claude Haiku 5.5
> leyendo tres documentos de ejemplo, el 22 oct 2026.

---

## Título

**Lectura automática de facturas con IA: de foto o PDF a Excel, con validación contable y revisión
humana**

Versión corta, si el campo es limitado:
**De fotos y PDFs de facturas a Excel, con IA que se revisa sola**

## Descripción

**El problema.** Pasar facturas y recibos a la contabilidad a mano consume horas y deja pasar errores. Las
herramientas de "OCR con IA" leen rápido, pero a veces se equivocan con total seguridad. Una factura mal
leída que entra a los libros cuesta más que una que no entra.

**La solución.** Subes las fotos o los PDFs y recibes un Excel listo para contabilidad. La diferencia está en
que **la IA nunca tiene la última palabra**:

- **Lee cualquier formato.** PDF digital, escaneo, foto del celular o recibo térmico, en español o en inglés.
- **Comprueba cada número.** Después de leer, unas reglas contables verifican que las líneas sumen el
  subtotal, que subtotal más impuesto dé el total, que la tasa de impuesto exista en el país y que el
  RUC o el RFC tenga el formato correcto.
- **Te muestra solo lo dudoso.** Lo que cumple todas las reglas se aprueba solo. Lo que no, va a una
  pantalla de revisión con el original al lado y el campo que falla marcado en rojo. La persona corrige y
  aprueba en segundos.
- **Exporta a Excel o CSV.** Los montos van como números y las fechas como fechas, con una hoja de facturas
  y otra de líneas.
- **Costo visible.** Leer una factura cuesta una fracción de centavo de dólar. El panel muestra el costo por
  documento, y un tope diario impide sorpresas en la factura.
- **No cuenta dos veces la misma factura.** Si subes el mismo archivo otra vez, lo reconoce y no lo vuelve a
  procesar. Y si la misma factura llega como PDF y como foto, se registra una sola vez: la segunda queda marcada
  como duplicada, con un enlace a la original.
- **Se prueba sin tener facturas a mano.** La pantalla de subida ofrece ejemplos de facturas y recibos ficticios
  de Nicaragua, México y otros países.

**Qué incluye un proyecto así para tu negocio:**
- La lectura de tus facturas, recibos u órdenes de compra, con los campos que tu contabilidad necesita.
- Las reglas de tu país y de tu negocio (proveedores conocidos, tasas, montos máximos) antes de aprobar.
- La pantalla de revisión para tu equipo y la exportación al formato que usa tu sistema contable.
- Una prueba con tus propios documentos, con la precisión medida antes de ponerlo en uso.

## Detalle técnico (para el cliente que lo pida)

- **Stack:** C# 14 sobre .NET 10, ASP.NET Core Minimal APIs, EF Core con PostgreSQL 18, .NET Aspire, Claude
  Haiku 5.5 con salida estructurada, PdfPig, SkiaSharp, ClosedXML, Next.js 16 y Playwright. Licencia MIT.
- **IA con control:** el modelo responde contra un JSON Schema y los montos se convierten a decimal exacto,
  nunca a punto flotante. Si una lectura rompe una regla, se lee una vez más con los errores como pista; si
  sigue fallando, o si el modelo dice que no está seguro de un campo clave, va a revisión.
- **Procesamiento en paralelo sin duplicados:** una cola en PostgreSQL (`FOR UPDATE SKIP LOCKED` con lease).
  Un test con 4 workers y 100 documentos comprueba que cada uno se procesa exactamente una vez.
- **Precisión medida:** 42 documentos sintéticos de evaluación, 12 de ellos degradados a propósito (escaneos
  de 100 dpi, fotos torcidas, recibos desteñidos, un sello de PAGADO sobre las líneas). Los resultados están
  versionados en el repo, incluida la configuración que no pasa el umbral.
- **Duplicados por clave de negocio:** ID fiscal del emisor + número + total, con un índice único en PostgreSQL,
  así que ni dos workers a la vez pueden registrar la misma factura dos veces.
- **Calidad:** 184 tests (dominio, casos de uso, reglas de arquitectura e integración con PostgreSQL real) y
  un test de punta a punta con Playwright que recorre la app en cada push, con respuestas grabadas del modelo
  para no gastar.
- **Seguridad del Excel:** el texto que viene del documento se neutraliza para que una celda como
  `=HYPERLINK(...)` no se ejecute al abrir el archivo.

## Habilidades sugeridas

C# · .NET · Inteligencia Artificial · Extracción de datos · Procesamiento de documentos · PostgreSQL ·
Excel · Next.js

(Elegir de la lista de Workana las que existan con ese nombre.)

## Archivos adjuntos

En `invoice-extractor/docs/demo/`, a 1920×1200. Son capturas de la app real en español, con las lecturas
que hizo Claude Haiku 5.5.

| Orden | Archivo | Pie de foto sugerido |
|---|---|---|
| 1 | `03-revision.png` | Lo que no cuadra va a revisión: el original al lado y el campo que falla, marcado |
| 2 | `02-lote.png` | Un lote de tres documentos: dos pasan todas las reglas y se aprueban solos |
| 3 | `04-aprobada.png` | Corregida y aprobada por una persona, con todas las reglas cumplidas |
| 4 | `05-panel.png` | El panel: cuántas se aprueban solas y cuánto cuesta leer cada una |
| 5 | `01-subida.png` | Subir un lote: PDF, escaneos o fotos, con el país de las reglas fiscales |
| Video | `demo.mp4` | 75 segundos del flujo completo, con subtítulos en español |

La primera imagen es la que más se ve en el listado: por eso va la revisión, que muestra a la vez la IA, el
control y a la persona que decide.

**Ejemplo de resultado:** `facturas-ejemplo.xlsx`, el Excel que exporta la demo. Sirve para adjuntarlo en una
propuesta cuando el cliente pregunta "¿y qué me entrega?".

## Enlaces

- Caso de estudio: https://www.juangomezb.com/es/projects/invoice-extractor
- Código: https://github.com/Juxn89/invoice-extractor

## Texto base para propuestas

Para pegar y adaptar cuando un proyecto pida digitalizar facturas, automatizar captura de datos de
documentos o pasar PDFs a Excel:

> Hola, [nombre]. Construí un sistema que lee facturas y recibos (fotos, escaneos o PDFs) con IA y los
> entrega en Excel. La diferencia con un OCR común es que cada lectura se comprueba con reglas contables:
> si los montos no cuadran, no se aprueba sola, sino que pasa a revisión con el campo marcado. En las pruebas
> no aprobó ningún documento con errores, y cada factura cuesta una fracción de centavo. Puedes ver el video
> y el código aquí: https://www.juangomezb.com/es/projects/invoice-extractor
>
> Para tu caso, [lo que pide el proyecto], lo adaptaría a [tus documentos y tus campos] y a [tu sistema
> contable o formato de salida]. Antes de ponerlo en uso lo mediríamos con una muestra de tus propios
> documentos, para que veas la precisión real con tus datos.

**Cuándo no aplica:** si los documentos ya llegan como XML estructurado (factura electrónica, CFDI o DTE),
no hace falta IA: se leen directo, y conviene decírselo al cliente.

---

## Cifras y de dónde salen

| Cifra | Fuente |
|---|---|
| 0 aprobaciones falsas en 42 documentos | `evals/results/claude-haiku-5-5-retry.json` y `…-retry-hard.json`, campo `falseAutoApproved` |
| 100 % de acierto en total, fecha, ID fiscal y número, con reintento | Los mismos archivos: `totalAccuracy`, `dateAccuracy`, `taxIdAccuracy`, `numberAccuracy` |
| 91,7 % en ID fiscal sin reintento, en el set difícil (no pasa el umbral de 95 %) | `evals/results/claude-haiku-5-5-hard.json` |
| 7 de 7 errores sembrados enviados a revisión | `plantedSentToReview` en los archivos con reintento (5 + 2) |
| USD 0,00065 por documento (estándar) y USD 0,00097 (difícil) | `costPerDocumentUsd`, con reintentos incluidos |
| USD 0,0022 la demo de tres documentos | Tabla `extractions` de la corrida, registrada en el ledger de presupuesto |
| 184 tests | `dotnet test` en el CI, 22 oct 2026, con las mejoras posteriores al MVP |

Todas las cifras de precisión salen de documentos sintéticos generados por el repo, no de facturas reales
de clientes. Lo correcto es decirlo así en la propuesta y ofrecer medir con documentos del cliente.

## Lo que todavía no incluye

Respecto al [`plan.md`](plan.md), para no prometer de más (los faltantes del MVP se completaron el 22 oct 2026;
ver la sección de mejoras del plan):
- No hay demo pública desplegada: se muestra con el video y el código.
- Un documento marcado como duplicado por error no tiene todavía una acción de "no es duplicado".
- El video y las capturas (regrabados el 22 oct 2026) muestran los ejemplos y los detalles de las reglas en
  español, pero no el aviso de duplicado: ninguno de los ejemplos es otra copia de una misma factura.
