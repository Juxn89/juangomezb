# P2 · `invoice-extractor`: lectura automática de facturas y recibos

> Índice: [`../README.md`](../README.md) · Repo: `juxn89/invoice-extractor` (por crear) ·
> Demo: **video y capturas** · Plan original del 13 oct 2026, **revisado el 21 oct 2026**.
> Fuentes: "Smart Invoice Parser" (*C# Projects for the AI Era*: structured output, validate AI answers) +
> #10 "Invoice Maker" del PDF.

## 0. Decisiones del 21 oct 2026

Lo que cambió respecto del plan original, después de terminar docs-assistant, claude-pr-review-bot y
talent-mcp:

| Tema | Antes | Ahora | Por qué |
|---|---|---|---|
| Demo | Pública en Azure + Neon, con cuota por IP | **Video de 60-90 s y capturas reales** | Igual que docs-assistant: cero hosting y cero gasto de API por terceros. Una demo pública se puede sumar después |
| Modelo | Haiku y, si falla la validación, Sonnet | **Siempre Haiku 5.5**; si falla la validación, **un reintento con Haiku** con los errores como contexto | Regla del usuario: usar siempre Haiku 5.5. El eval mide cuánto aporta el reintento |
| Formatos | PDF, JPG, PNG y HEIC | **PDF, JPG y PNG** | HEIC exige libheif en el contenedor; se puede pedir al cliente que exporte a JPG |
| Países | NI, MX, CO, CR y genérico | **Nicaragua, México y genérico** | Colombia y Costa Rica quedan como extensión, con el patrón Strategy ya preparado |
| Base | Repo `dotnet-ai-template` | **La estructura de docs-assistant** | El template nunca se creó; docs-assistant ya tiene Aspire, Clean Architecture, guardas de gasto en evals y CI |
| Imágenes | ImageSharp (implícito) | **SkiaSharp** (MIT) | ImageSharp usa la Six Labors Split License: no es OSI y exige licencia comercial a empresas grandes |
| README | Libre | **Lineamientos del gist** (`readme-guidelines.md`) | Mismo estilo que los otros tres repos |

## 1. Contexto y pitch

**Para el cliente:** *"Sube fotos o PDFs de tus facturas y recibos, y recibe un Excel listo para tu contador.
Lo que la IA no puede confirmar, te lo marca para que lo revises en segundos."*

Digitar facturas a mano es un dolor universal de PyMEs, contadores y administradores, y en Workana aparece
como "automatizar captura de facturas", "OCR de recibos" o "pasar PDFs a Excel". El diferencial frente a un
OCR con LLM sin más: **la IA nunca tiene la última palabra**. Cada extracción pasa por reglas contables
determinísticas (que las líneas sumen y que el impuesto cuadre) y lo dudoso va a una cola de revisión humana
con el campo resaltado. Precisión medida, costo por documento visible.

## 2. Alcance del MVP

**Entra**
- Upload por lote (arrastrar y soltar) de **PDF, JPG y PNG**, con un máximo de 10 MB por archivo y 20
  archivos por lote.
- Extracción a un esquema fijo: emisor (nombre, ID fiscal), receptor, número, fecha, moneda, líneas
  (descripción, cantidad, precio unitario, total), subtotal, impuestos (tasa y monto), total, y la
  confianza de cada campo.
- **Validación determinística** con reglas por país (**Nicaragua, México y genérico**): formato del ID
  fiscal, tasa de impuesto plausible, aritmética y fechas.
- **Cola de revisión:** visor del documento con el campo dudoso resaltado al lado de un formulario
  editable. Al aprobar, el documento pasa a `approved`.
- **Export** a Excel (ClosedXML, MIT) con una hoja de resumen y otra de líneas, y a CSV.
- **Deduplicación** por hash del archivo y también por clave de negocio (emisor + número + total).
- Dashboard: documentos procesados, % auto-aprobados, % a revisión, costo total y costo medio por documento.
- **12 muestras de ejemplo** de un clic ("probar con un ejemplo"), para el video y para quien lo corra en
  local sin facturas a mano.

**No entra**
- Integración con un ERP o software contable concreto: se deja un puerto `IAccountingExport` con el
  adaptador Excel/CSV y se menciona como extensible.
- Generación de facturas (la idea #10 original): el valor diferencial está en la lectura.
- Facturación electrónica oficial (DTE/CFDI XML): si el archivo ya es XML estructurado, no hace falta IA,
  y eso se dice en la ficha.
- HEIC y reglas de Colombia y Costa Rica (ver §0).
- Demo pública y despliegue en la nube (ver §0 y §9).

## 3. Arquitectura

```
web (Next.js) ── upload ──▶ Api /v1/batches  →  IFileStore (disco local)  +  fila documents(status=queued)
                                     │
             ExtractionWorker (BackgroundService) ── SELECT … FOR UPDATE SKIP LOCKED ── N instancias en paralelo
                                     │
         1. Preprocesado: PdfPig (¿tiene capa de texto?) / imagen → SkiaSharp (orientación EXIF, lado largo ≤ 1568 px)
         2. Extracción: texto o imagen → Haiku 5.5, salida estructurada (JSON Schema generado desde InvoiceExtraction)
         3. Validación determinística (Domain): InvoiceRules + reglas por país (Strategy)
         4. ¿Falla una regla? → un reintento con Haiku 5.5, pasando los errores de validación como contexto
         5. ¿Sigue fallando o hay un campo con confianza < umbral? → needs_review   ·   si no → auto_approved
                                     │
web: cola de revisión · aprobados · export Excel/CSV · dashboard de costos
```

- **Cola en Postgres** con `FOR UPDATE SKIP LOCKED`: varios workers compiten sin duplicar trabajo, sin
  broker y sin dependencias comerciales. Un `lease_until` recupera los trabajos de un worker caído.
- **Reintento con feedback, medido:** el eval compara "Haiku sin reintento" con "Haiku con reintento"
  en precisión y costo, y el README publica la tabla. **La decisión sale del dato, no de la intuición.**
- **Archivos:** puerto `IFileStore` con adaptador de disco local. Sin nube en el MVP.
- **Orquestación:** Aspire AppHost (Postgres + API + worker + web) y un `docker compose` equivalente, como
  docs-assistant.

## 4. Modelo de datos

```
batches(id, created_at, file_count)
documents(id, batch_id, file_name, content_hash UNIQUE, mime, pages, status, attempts, lease_until,
          created_at, processed_at)
            status: queued → processing → auto_approved | needs_review | approved | failed | duplicate
extractions(id, document_id, model, attempt, raw_json jsonb, confidence jsonb, validation_errors jsonb,
            prompt_hash, input_tokens, output_tokens, cost_usd numeric(12,6), created_at)
invoices(id, document_id, issuer_name, issuer_tax_id, receiver_name, number, issue_date, currency,
         subtotal numeric(18,2), tax_total numeric(18,2), total numeric(18,2), country, reviewed_by, approved_at)
invoice_lines(id, invoice_id, ordinal, description, quantity numeric(18,4), unit_price numeric(18,4), line_total numeric(18,2))
```

- Los montos son `decimal` y `numeric` **siempre**, nunca `double`.
- El índice único parcial `(issuer_tax_id, number, total)` detecta duplicados de negocio aunque el archivo
  sea otro (otra foto de la misma factura).
- El costo de cada llamada queda en `extractions`, que alimenta el dashboard y el "costo por documento".

## 5. Diseño de IA

| Aspecto | Decisión |
|---|---|
| Modelo | `claude-haiku-5-5` en todos los pasos, con visión para imágenes y PDFs escaneados |
| Reintento | Uno solo, con Haiku, si falla la validación, con los errores como contexto ("las líneas suman 1.150 y el subtotal leído es 1.510; revisa") |
| Salida | **Structured outputs** con un JSON Schema generado desde el record `InvoiceExtraction`. Los montos llegan como **string decimal** para no perder precisión en el JSON |
| Confianza | Por campo, en el esquema (`high`/`medium`/`low`), más una señal objetiva: si la regla aritmética falla, los campos implicados bajan a `low` |
| Prompt | `Prompts/extract-invoice.md`: no inventar campos ausentes (`null` si no se ve), copiar el ID fiscal tal cual sin "corregirlo" e indicar la moneda solo si es explícita |
| Guardrails | Tamaño, tipo MIME real (magic bytes, no la extensión), páginas máximas y texto del documento tratado como dato (una factura que diga "ignora instrucciones" no cambia nada: el esquema y la validación lo contienen) |
| Costo esperado | Con Haiku 5.5 a USD 0,10 / 0,50 por millón de tokens, una imagen ≈ 1.600 tokens de entrada y ≈ 600 de salida: **≈ USD 0,0005 por documento**. Con reintento en ~15 % de los casos, **≈ USD 0,0006**. Se mide y se muestra en la UI |

**Por verificar el día 4, antes de escribir la extracción:** cómo se piden structured outputs con el SDK
de Anthropic para C# (el bot de PRs lo hace con `output_config.format` directo en el SDK; docs-assistant
pasa por Microsoft.Extensions.AI). Elegir uno y anotar la fuente con fecha.

**Validación determinística (Domain, sin IA)**
- `Σ line_total ≈ subtotal` (tolerancia de ±0,01 por línea por redondeo).
- `subtotal + tax_total ≈ total`.
- `quantity × unit_price ≈ line_total`.
- Tasa implícita = `tax_total / subtotal` ∈ tasas válidas del país (NI 15 %, MX 16 % y 8 %), configurables y
  no hardcodeadas.
- ID fiscal: formato por país (RUC de Nicaragua, RFC de México con su estructura).
- Fecha: no futura y no anterior a 10 años.

**Evals** (`evals/`, dataset de **30 facturas sintéticas** generadas con un script propio a partir de un
generador PDF/imagen. Incluye fotos torcidas, recibos térmicos y facturas en EN y ES. Cada una tiene su JSON
esperado):

| Métrica | Umbral |
|---|---|
| Exactitud por campo (exact match normalizado) en total, fecha, ID fiscal y número | ≥ 0,95 |
| Exactitud de líneas (F1 por línea) | ≥ 0,90 |
| % auto-aprobado **correcto** (sin error en un campo clave) | ≥ 0,98 de los auto-aprobados |
| Falsos auto-aprobados (error que no se mandó a revisión) | ≤ 1 en 30 |
| Costo medio por documento | ≤ USD 0,001 |

La comparación de las 2 configuraciones (sin y con reintento) se versiona en `evals/results/`.

**Guardas de gasto**, las mismas de docs-assistant: el eval no llama a la API sin `--allow-paid`, con tope
de llamadas, tope de costo y registro en el ledger compartido (`~/.anthropic-budget/`). Se necesita **una
API key nueva** y un tope de sesión aprobado por el usuario. Estimación: 30 documentos × 2 configuraciones ×
~2 corridas ≈ 120 llamadas ≈ **USD 0,07**; propuesta de tope: **USD 0,25**.

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| "La IA propone, el dominio decide" | `Domain/InvoiceRules`, reglas por país con Strategy |
| Reintento con feedback, justificado con datos | tabla de precisión y costo en el README |
| Cola concurrente sin broker | `ExtractionWorker`, test de 4 workers × 100 documentos sin duplicados |
| Idempotencia doble (archivo y negocio) | índice único + test |
| Aritmética exacta | `decimal`/`numeric` + tests de redondeo |
| Human-in-the-loop de primera clase | cola de revisión con el campo resaltado |
| Costo por documento visible | `extractions.cost_usd` y el dashboard |

## 7. ADRs

1. Validación determinística después del LLM: por qué no confiar en la confianza autodeclarada del modelo.
2. Reintento con Haiku y feedback de validación, en vez de escalar de modelo; con la tabla del eval.
3. Cola en Postgres (`SKIP LOCKED`) frente a RabbitMQ o Hangfire para este volumen.
4. Montos como string decimal en el esquema del LLM.
5. Dataset sintético propio: privacidad (cero facturas reales) y reproducibilidad.
6. SkiaSharp para el preprocesado de imágenes, y por qué no ImageSharp (licencia).

## 8. Tests

- **Domain:** las reglas aritméticas, la tasa por país, los validadores de ID fiscal (con casos reales de
  formato, no de personas) y el redondeo.
- **Application:** el flujo completo con un `IChatClient` falso: auto-aprobado, reintento y revisión.
- **Integración** (Testcontainers): concurrencia de la cola (4 workers y 100 documentos → cada uno procesado
  exactamente una vez), recuperación por `lease_until`, deduplicación y export a Excel (se abre el archivo
  generado con ClosedXML y se verifican celdas).
- **Evals:** la tabla de §5. En CI corren sin modelo, contra un oracle; con Haiku, solo a mano con
  `--allow-paid`, como en docs-assistant.
- **E2E** (Playwright): subir 3 muestras → 2 auto-aprobadas y 1 en revisión → corregir el campo → aprobar
  → descargar el Excel y verificar la fila.

## 9. Demo: video y capturas

- **Video de 60-90 s**, grabado con el mismo método que docs-assistant (screencast de Chromium + ffmpeg
  en contenedor): subir un lote, ver los estados en vivo, abrir la factura que fue a revisión con el campo
  resaltado, corregirla, aprobar y descargar el Excel abierto.
- **Capturas** en `docs/demo/`, nombradas en orden y en español.
- Todo corre en local (`dotnet run` del AppHost o `docker compose up`), con las 12 muestras de ejemplo.
- Una demo pública queda fuera del MVP: se puede sumar después con cuota por IP y tope de gasto diario, como
  proponía el plan original.

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo con la estructura de docs-assistant; verificar versiones del día; dominio `Invoice` con montos `decimal`; reglas aritméticas y por país (NI, MX, genérico) con tests |
| 2 | Generador de dataset sintético (30 facturas + JSON esperado) y 12 muestras; harness de eval sin modelo, contra un oracle |
| 3 | Upload, `IFileStore`, preprocesado (PdfPig con detección de capa de texto, SkiaSharp para imágenes) y deduplicación |
| 4 | Verificar structured outputs en el SDK; extracción con Haiku; primer eval real con guardas de gasto |
| 5 | Cola `SKIP LOCKED` con lease, worker y test de concurrencia |
| 6 | Reintento con feedback; eval comparando las 2 configuraciones; ADR |
| 7 | Web: upload por lote, estados en vivo (polling o SSE) y cola de revisión con resaltado |
| 8 | Export a Excel y CSV; dashboard de costos y tasas |
| 9 | E2E, video y capturas |
| 10 | README según el gist, `workana.md`, entrada en el portfolio con galería y video |

## 11. GitHub metadata y ficha Workana

- **Descripción:** "AI invoice & receipt extraction in .NET 10: structured outputs, deterministic accounting validation, human review queue, Excel export, evals & cost per document."
- **Topics:** `dotnet`, `csharp`, `invoice-processing`, `document-ai`, `ocr`, `structured-output`, `claude`, `anthropic`, `postgresql`, `human-in-the-loop`, `llm-evaluation`, `excel`, `nextjs`, `aspire`

**Borrador de la ficha Workana (ES)**
- **Título:** Lectura automática de facturas con IA: de foto o PDF a Excel, con validación contable
- **Problema:** digitar facturas a mano consume horas y se cuelan errores.
- **Solución:** subes los archivos y recibes un Excel. El sistema verifica que los montos e impuestos
  cuadren y te marca solo lo dudoso para revisión.
- **Qué demuestra:** precisión medida por campo sobre un set de prueba, un costo de IA de una fracción de
  centavo por factura, procesamiento en paralelo sin duplicados y revisión humana integrada. Video del flujo
  completo.
- **Stack:** .NET 10, PostgreSQL, Claude Haiku (visión + salida estructurada), Next.js.

## 12. Verificación / terminado

- Tests, evals sin modelo por encima del umbral y E2E en CI. La corrida con Haiku, registrada en el ledger.
- En local: cada una de las 12 muestras termina en el estado esperado; la factura con un error aritmético
  plantado va a revisión con el campo `subtotal` resaltado.
- Subir el mismo archivo dos veces → `duplicate` sin un segundo costo de IA (verificado en `extractions`).
- El Excel descargado abre en Excel y en LibreOffice con los montos como número, no como texto.
- Checklist común de [`../README.md`](../README.md#definición-de-terminado-común-a-todos), con el README
  según los lineamientos del gist.

## Versiones verificadas (21 oct 2026)

Fuente: API de registro de NuGet. Regla: la versión más nueva con **al menos 2 semanas** de antigüedad.

| Paquete | Más nueva | Elegible (≥ 2 semanas) | Licencia |
|---|---|---|---|
| `Anthropic` | 12.60.0 (20 oct) | **12.53.0** (30 sep); docs-assistant usa 12.55.0, decidir el día 1 | MIT |
| `Microsoft.Extensions.AI` | 10.11.0 (14 oct) | **10.10.0** (9 sep) | MIT |
| `PdfPig` | 0.1.16 (22 ago) | **0.1.16** | Apache-2.0 |
| `ClosedXML` | 0.105.1 (25 jul) | **0.105.1** | MIT |
| `SkiaSharp` | 4.153.1 (30 sep) | **4.153.1** | MIT |
| `Aspire.Hosting.AppHost` | 13.6.2 (20 oct) | **13.6.1** (7 oct) | MIT |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | 10.0.3 (10 jul) | **10.0.3** | PostgreSQL |
| `Testcontainers.PostgreSql` | 4.16.0 (8 oct) | **4.15.0** (6 sep) | MIT |
| ~~`SixLabors.ImageSharp`~~ | 4.1.3 | — | Six Labors Split License: **descartado** |

Se vuelven a verificar el día 1, porque las elegibles cambian con el tiempo.
