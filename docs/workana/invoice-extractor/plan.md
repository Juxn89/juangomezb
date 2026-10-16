# P2 · `invoice-extractor`: lectura automática de facturas y recibos

> Índice: [`../README.md`](../README.md) · Base: [`dotnet-ai-template`](../dotnet-ai-template/plan.md) ·
> Semanas 3-4 · Repo: `juxn89/invoice-extractor` · Demo: **pública con muestras y cuota** ·
> Versiones verificadas el 13 oct 2026.
> Fuentes: "Smart Invoice Parser" (*C# Projects for the AI Era*: structured output, validate AI answers) +
> #10 "Invoice Maker" del PDF.

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
- Upload por lote (arrastrar y soltar) de PDF, JPG, PNG y HEIC, con un máximo de 10 MB por archivo y 20
  archivos por lote.
- Extracción a un esquema fijo: emisor (nombre, ID fiscal), receptor, número, fecha, moneda, líneas
  (descripción, cantidad, precio unitario, total), subtotal, impuestos (tasa y monto), total, y la
  confianza de cada campo.
- **Validación determinística** con reglas por país (Nicaragua, México, Colombia, Costa Rica y genérico):
  formato del ID fiscal, tasa de impuesto plausible, aritmética y fechas.
- **Cola de revisión:** visor del documento con el campo dudoso resaltado al lado de un formulario
  editable. Al aprobar, el documento pasa a `approved`.
- **Export** a Excel (ClosedXML 0.105.1, MIT) con una hoja de resumen y otra de líneas, y a CSV.
- **Deduplicación** por hash del archivo y también por clave de negocio (emisor + número + total).
- Dashboard: documentos procesados, % auto-aprobados, % a revisión, costo total y costo medio por documento.

**No entra**
- Integración con un ERP o software contable concreto: se deja un puerto `IAccountingExport` con el
  adaptador Excel/CSV y se menciona como extensible.
- Generación de facturas (la idea #10 original): fuera del MVP. El valor diferencial está en la lectura.
- Facturación electrónica oficial (DTE/CFDI XML): fuera del MVP. Si el archivo ya es XML estructurado, no
  hace falta IA, y eso se dice en la ficha.

## 3. Arquitectura

```
web (Next.js) ── upload ──▶ Api /v1/batches  →  blob local/Azure Blob  +  fila documents(status=queued)
                                     │
             ExtractionWorker (BackgroundService) ── SELECT … FOR UPDATE SKIP LOCKED ── N instancias en paralelo
                                     │
         1. Preprocesado: PdfPig (¿tiene capa de texto?) / imagen → normalizar (rotación, tamaño)
         2. Extracción LLM: texto → Haiku | imagen o PDF escaneado → Haiku con visión
              salida estructurada (output_config.format = JSON Schema generado desde InvoiceExtraction)
         3. Validación determinística (Domain): InvoiceRules + reglas por país (Strategy)
         4. ¿Falla una regla? → reintento único con Sonnet, pasando los errores de validación como feedback
         5. ¿Sigue fallando o hay un campo con confianza < umbral? → needs_review   ·   si no → auto_approved
                                     │
web: cola de revisión · aprobados · export Excel/CSV · dashboard de costos
```

- **Cola en Postgres** con `FOR UPDATE SKIP LOCKED`: varios workers compiten sin duplicar trabajo, sin
  broker y sin dependencias comerciales. Un `lease_until` recupera los trabajos de un worker caído.
- **Cascada de modelos medida:** Haiku primero (≈ 20× más barato) y Sonnet solo cuando la validación
  falla. El eval compara tres configuraciones (solo Haiku, cascada y solo Sonnet) en precisión y costo, y
  el README publica la tabla. **La decisión sale del dato, no de la intuición.**
- **Archivos:** puerto `IFileStore` con adaptador de disco local (compose) y Azure Blob (demo). Los archivos
  de la demo se borran a las 24 h.

## 4. Modelo de datos

```
batches(id, created_at, source_ip_hash, file_count)
documents(id, batch_id, file_name, content_hash UNIQUE, mime, pages, status, attempts, lease_until,
          created_at, processed_at)
            status: queued → processing → auto_approved | needs_review | approved | failed | duplicate
extractions(id, document_id, model, attempt, raw_json jsonb, confidence jsonb, validation_errors jsonb,
            prompt_hash, created_at)
invoices(id, document_id, issuer_name, issuer_tax_id, receiver_name, number, issue_date, currency,
         subtotal numeric(18,2), tax_total numeric(18,2), total numeric(18,2), country, reviewed_by, approved_at)
invoice_lines(id, invoice_id, ordinal, description, quantity numeric(18,4), unit_price numeric(18,4), line_total numeric(18,2))
ai_usage(...)     ← del template
```

- Los montos son `decimal` y `numeric` **siempre**, nunca `double`.
- El índice único parcial `(issuer_tax_id, number, total)` detecta duplicados de negocio aunque el archivo
  sea otro (otra foto de la misma factura).

## 5. Diseño de IA

| Aspecto | Decisión |
|---|---|
| Modelo principal | `claude-haiku-5-5`, con visión para imágenes y PDFs escaneados |
| Escalado | `claude-sonnet-5-5`, un reintento solo si falla la validación, con los errores como feedback ("las líneas suman 1.150 y el subtotal leído es 1.510; revisa") |
| Salida | **Structured outputs** (`output_config.format`) con un JSON Schema generado desde el record `InvoiceExtraction`. Los montos llegan como **string decimal** para no perder precisión en el JSON |
| Confianza | Por campo, en el esquema (`high`/`medium`/`low`), más una señal objetiva: si la regla aritmética falla, los campos implicados bajan a `low` |
| Prompt | `Prompts/extract-invoice.md`: no inventar campos ausentes (`null` si no se ve), copiar el ID fiscal tal cual sin "corregirlo" e indicar la moneda solo si es explícita |
| Guardrails | Tamaño, tipo MIME real (magic bytes, no la extensión), páginas máximas y texto del documento tratado como dato (una factura que diga "ignora instrucciones" no cambia nada: el esquema y la validación lo contienen) |
| Costo esperado | Imagen ≈ 1.600 tokens de input y ≈ 600 de output con Haiku: **≈ $0,0005 por documento**. Con escalado a Sonnet en ~10% de los casos, la media sube a **≈ $0,002**. Se mide y se muestra en la UI |

**Validación determinística (Domain, sin IA)**
- `Σ line_total ≈ subtotal` (tolerancia de ±0,01 por línea por redondeo).
- `subtotal + tax_total ≈ total`.
- `quantity × unit_price ≈ line_total`.
- Tasa implícita = `tax_total / subtotal` ∈ tasas válidas del país (NI 15%, MX 16%/8%, CO 19%/5%, CR 13%…),
  configurables y no hardcodeadas.
- ID fiscal: formato por país (RUC NI, RFC MX con su estructura, NIT CO con dígito de verificación).
- Fecha: no futura y no anterior a 10 años.

**Evals** (`tests/Evals`, dataset de **30 facturas sintéticas** generadas con un script propio a partir de un
generador PDF/imagen. Incluye fotos torcidas, recibos térmicos y facturas en EN y ES. Cada una tiene su JSON
esperado):

| Métrica | Umbral |
|---|---|
| Exactitud por campo (exact match normalizado) en total, fecha, ID fiscal y número | ≥ 0,95 |
| Exactitud de líneas (F1 por línea) | ≥ 0,90 |
| % auto-aprobado **correcto** (sin error en un campo clave) | ≥ 0,98 de los auto-aprobados |
| Falsos auto-aprobados (error que no se mandó a revisión) | ≤ 1 en 30 |
| Costo medio por documento | ≤ $0,003 |

La comparación de las 3 configuraciones (Haiku, cascada y Sonnet) se versiona en `evals/results/`.

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| "La IA propone, el dominio decide" | `Domain/InvoiceRules`, reglas por país con Strategy |
| Cascada de modelos justificada con datos | tabla de costo y precisión en el README |
| Cola concurrente sin broker | `ExtractionWorker`, test de 4 workers × 100 documentos sin duplicados |
| Idempotencia doble (archivo y negocio) | índice único + test |
| Aritmética exacta | `decimal`/`numeric` + tests de redondeo |
| Human-in-the-loop de primera clase | cola de revisión con el campo resaltado |

## 7. ADRs

1. Validación determinística después del LLM: por qué no confiar en la confianza autodeclarada del modelo.
2. Cascada Haiku → Sonnet, con la tabla del eval.
3. Cola en Postgres (`SKIP LOCKED`) frente a RabbitMQ o Hangfire para este volumen.
4. Montos como string decimal en el esquema del LLM.
5. Dataset sintético propio: privacidad (cero facturas reales) y reproducibilidad.

## 8. Tests

- **Domain:** las reglas aritméticas, la tasa por país, los validadores de ID fiscal (con casos reales de
  formato, no de personas) y el redondeo.
- **Application:** el flujo completo con `FakeChatClient`: auto-aprobado, escalado y revisión.
- **Integración:** concurrencia de la cola (4 workers y 100 documentos → cada uno procesado exactamente una
  vez), recuperación por `lease_until`, deduplicación y export a Excel (se abre el archivo generado con
  ClosedXML y se verifican celdas).
- **Evals:** la tabla de §5 en CI (PRs que tocan `Extraction/`, `Prompts/` o `Rules/`, y cada noche).
- **E2E:** subir 3 muestras → 2 auto-aprobadas y 1 en revisión → corregir el campo → aprobar → descargar el
  Excel y verificar la fila.

## 9. Demo y hosting

- Azure Container Apps (API + worker en el mismo contenedor, con un `BackgroundService`), Neon, Vercel y
  Azure Blob (free tier de la cuenta) o el disco del contenedor con limpieza cada 24 h.
- **12 muestras precargadas** de un clic ("probar con un ejemplo") para quien no tenga facturas a mano.
- Uploads propios: **5 documentos por IP al día**, 5 MB cada uno, `DailyBudgetUsd = 1` y borrado a las 24 h
  (aviso visible: "no subas documentos reales con datos sensibles").
- Reset nocturno de lotes de la demo.

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo desde el template; dominio `Invoice` con montos `decimal`; reglas aritméticas y por país con tests |
| 2 | Generador de dataset sintético (30 facturas + JSON esperado); harness de eval (todavía sin LLM, con un oracle) |
| 3 | Upload, `IFileStore`, preprocesado (PdfPig con detección de capa de texto, normalización de imagen) y deduplicación |
| 4 | Extracción con structured outputs (Haiku) y primer eval real |
| 5 | Cola `SKIP LOCKED` con lease, worker y test de concurrencia |
| 6 | Escalado a Sonnet con feedback de validación; eval comparando 3 configuraciones; ADR |
| 7 | Web: upload por lote, lista de estados en vivo (polling o SSE) y cola de revisión con resaltado |
| 8 | Export a Excel y CSV; dashboard de costos y tasas |
| 9 | Despliegue, muestras precargadas, cuotas y limpieza |
| 10 | E2E, README, video, capturas y `workana.md` |

## 11. GitHub metadata y ficha Workana

- **Descripción:** "AI invoice & receipt extraction in .NET 10: structured outputs, deterministic accounting validation, model cascade, human review queue, Excel export, evals & cost per document."
- **Topics:** `dotnet`, `csharp`, `invoice-processing`, `document-ai`, `ocr`, `structured-output`, `claude`, `anthropic`, `microsoft-extensions-ai`, `postgresql`, `human-in-the-loop`, `llm-evaluation`, `excel`, `nextjs`

**Borrador de la ficha Workana (ES)**
- **Título:** Lectura automática de facturas con IA: de foto o PDF a Excel, con validación contable
- **Problema:** digitar facturas a mano consume horas y se cuelan errores.
- **Solución:** subes los archivos y recibes un Excel. El sistema verifica que los montos e impuestos
  cuadren y te marca solo lo dudoso para revisión.
- **Qué demuestra:** precisión medida por campo sobre un set de prueba, costo de ≈ $0,002 por factura,
  procesamiento en paralelo sin duplicados y revisión humana integrada. **Demo en vivo con facturas de
  ejemplo.**
- **Stack:** .NET 10, PostgreSQL, Claude (visión + salida estructurada), Next.js, Azure.

## 12. Verificación / terminado

- Tests, evals por encima del umbral y E2E en CI.
- En producción: cada una de las 12 muestras termina en el estado esperado; la factura con un error
  aritmético plantado va a revisión con el campo `subtotal` resaltado.
- Subir el mismo archivo dos veces → `duplicate` sin un segundo costo de IA (verificado en `ai_usage`).
- El Excel descargado abre en Excel y en LibreOffice con los montos como número, no como texto.
- Checklist común de [`../README.md`](../README.md#definición-de-terminado-común-a-todos).
