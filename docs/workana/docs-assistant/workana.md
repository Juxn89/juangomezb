# Ficha Workana · `docs-assistant`

> Ficha final para el portafolio de Workana. Escrita el 16 oct 2026, con las cifras medidas ese día
> ([evals-haiku-plan.md](evals-haiku-plan.md)). Repo: [github.com/Juxn89/docs-assistant](https://github.com/Juxn89/docs-assistant).
> Plan: [plan.md](plan.md).
>
> **Antes de publicar:** revisar en el formulario de Workana el límite de caracteres de cada campo y los
> nombres exactos de las habilidades. No los verifiqué, porque no se pueden ver sin abrir el formulario.

---

## Formulario de Workana (23 oct 2026)

Lo que se pega en "Agregar / Editar proyecto". El formulario pide un título (mínimo 15 caracteres), una
descripción en texto plano (mínimo 45), hasta 5 habilidades (del catálogo de Workana), una portada y una galería en
1:1, 16:9 o 4:3 (JPG, GIF o PNG, hasta 4 MB) y la fecha de finalización. No acepta video, así que el video va
como enlace en la descripción y, donde hay video, la portada es un GIF de su momento clave.

Las imágenes están en `formulario/`, ignorado por git; se regeneran con el script de la sesión del 23 oct
2026 a partir de `docs/demo` del repo del proyecto.

| Campo | Valor |
|---|---|
| Título | Asistente de IA para tu web: responde a tus clientes con tus documentos y te pasa los que necesitan a una persona (113 caracteres) |
| Habilidades (5) | .Net Core · Inteligencia Artificial · Chatbot · C# · PostgreSQL |
| Fecha de finalización | 10-2026 |
| Imagen de portada | `portada.gif`: el cliente pregunta y el asistente responde citando sus fuentes, también en inglés (18 s) |
| Imágenes de galería, en este orden | `galeria-1.jpg`: respuesta con las fuentes de donde salió<br>`galeria-2.jpg`: un intento de manipulación que no funciona<br>`galeria-3.jpg`: no inventa y ofrece pasar con una persona<br>`galeria-4.jpg`: el correo que le llega al negocio con la conversación<br>`galeria-5.jpg`: el asistente en el celular<br>`galeria-6.jpg`: los resultados medidos |
| Archivos (PDF) | Ninguno |

**Descripción** (1021 caracteres), para pegar tal cual:

```text
Un asistente de IA que se agrega a tu sitio web con una sola línea de código y responde a tus clientes las 24 horas con la información de tus propios documentos: políticas, catálogo y preguntas frecuentes, en PDF, Word o páginas web.

- En cada respuesta muestra de qué documento sacó la información.
- No inventa: si la respuesta no está en tus documentos, lo dice y ofrece pasar al cliente con una persona.
- El cliente deja su contacto en el mismo chat y a ti te llega un correo con toda la conversación.
- Responde en español o en inglés, aunque tus documentos estén en un solo idioma.
- No se deja manipular, y funciona en el celular sin romper el diseño de tu web.

Medido con 54 preguntas de prueba: 95 % de las respuestas citan el fragmento correcto, 0 respuestas inventadas, 12 de 12 intentos de manipulación bloqueados y USD 0,33 por cada 1.000 preguntas.

Stack: C# y .NET 10, PostgreSQL con búsqueda vectorial, Claude, TypeScript.
Video y caso de estudio: https://www.juangomezb.com/es/projects/docs-assistant
```

`.Net Core` va en todos los proyectos con ese nombre exacto, el mismo de las habilidades principales del
perfil, para que cuente en su columna "Proyectos trabajados"; lo mismo `React.js` donde hay web en React.
Si alguna otra no aparece en el catálogo, se cambia por la más cercana.

## Título

**Asistente de IA para tu web: responde a tus clientes con tus documentos y te pasa los que necesitan a una persona**

Versión corta, si el campo es limitado:
**Chatbot de soporte con IA que responde con tus documentos y no inventa**

## Descripción

**El problema.** Tus clientes preguntan lo mismo todos los días: envíos, devoluciones, precios, horarios.
Tu equipo pierde horas contestando, y fuera del horario esas preguntas quedan sin respuesta. Los chatbots
genéricos tampoco sirven: inventan respuestas que tu negocio después tiene que corregir.

**La solución.** Un asistente que se agrega a tu sitio web con una sola línea de código:

- **Responde solo con tu información.** Lee tus documentos (políticas, catálogo, preguntas frecuentes en
  PDF, Word o páginas web) y en cada respuesta muestra de qué documento la sacó.
- **No inventa.** Si la respuesta no está en tus documentos, lo dice y ofrece pasar el cliente a una
  persona.
- **No pierdes al cliente.** El cliente deja su email en el mismo chat y a ti te llega un correo con toda la
  conversación, listo para responderle.
- **Habla el idioma de tu cliente.** Responde en español o en inglés, aunque tus documentos estén en un
  solo idioma.
- **No se deja manipular.** Ignora a quien intente hacerle decir lo que no debe.
- **Funciona en el celular** y no rompe el diseño de tu web.

**Medido, no prometido.** Lo probé con 54 preguntas de prueba y publico los resultados:

| | Resultado |
|---|---|
| Respuestas que citan el fragmento correcto | **95 %** |
| Respuestas inventadas cuando la información no estaba | **0** |
| Intentos de manipulación bloqueados | **12 de 12** |
| Costo del modelo de IA | **USD 0,33 por cada 1.000 preguntas** |

**Qué incluye un proyecto así:**
- Carga de tus documentos.
- Instalación en tu sitio.
- Configuración del correo donde recibes los contactos.
- Límites de uso para que el gasto nunca te sorprenda.
- Una prueba con preguntas reales de tu negocio antes de publicarlo.

En el video de 75 segundos lo ves funcionando en una tienda de ejemplo.

## Detalle técnico (para el cliente que lo pida)

- **Backend:** .NET 10 (C#), API con respuestas en streaming y arquitectura limpia verificada con tests.
- **Búsqueda:** híbrida, semántica más palabras clave, en PostgreSQL con pgvector. Encuentra el fragmento
  correcto en el 98 % de las preguntas de prueba, y en el 95 % cuando la pregunta y el documento están en
  idiomas distintos.
- **IA:** Claude Haiku 5.5 de Anthropic, detrás de una capa intercambiable. Si no hay modelo disponible,
  responde citando textualmente los documentos.
- **Seguridad:**
  - Cada cliente ve solo sus datos, y está probado.
  - Defensa contra manipulación del asistente.
  - El widget solo funciona en los dominios autorizados.
  - Límites de uso por visitante.
- **Calidad:** más de 300 tests automáticos y evaluaciones de calidad y de costo que se pueden volver a
  correr. El código es público.

## Habilidades sugeridas

C# · .NET · Inteligencia Artificial · Chatbots · PostgreSQL · TypeScript · API REST · Integración de APIs

(Elegir de la lista de Workana las que existan con ese nombre.)

## Archivos adjuntos

Todos en `docs-assistant/docs/demo/`. Las capturas miden 1920×1080 y hay copias de 1280×720 en la carpeta de
la sesión, por si Workana pide menos peso.

| Orden | Archivo | Pie de foto sugerido |
|---|---|---|
| Video | `docs-assistant-demo.mp4` (75 s, 4,1 MB) | El asistente funcionando en una tienda de ejemplo |
| 1 | `02-respuesta-con-fuentes.png` | Responde con tu información y muestra de qué documento sale |
| 2 | `05-no-inventa-ofrece-persona.png` | Si no sabe, no inventa: ofrece pasar el cliente a una persona |
| 3 | `07-correo-al-negocio.png` | Te llega un correo con la conversación completa |
| 4 | `03-responde-en-ingles.png` | Responde en el idioma de tu cliente |
| 5 | `04-resiste-manipulacion.png` | No se deja manipular |
| 6 | `08-celular.png` | También en el celular |
| 7 | `09-resultados-medidos.png` | Resultados medidos con 54 preguntas de prueba |
| 8 | `06-formulario-de-contacto.png` | El cliente deja su contacto en el mismo chat |
| — | `01-portada.png` | Imagen de portada, si la galería la pide aparte |

La primera imagen es la que más se ve en el listado: por eso va la respuesta con fuentes y no la portada,
que es solo texto.

## Enlaces

- Caso de estudio: https://www.juangomezb.com/es/projects/docs-assistant
- Video, en el sitio: https://www.juangomezb.com/es/projects/docs-assistant#demo
- Código: https://github.com/Juxn89/docs-assistant
- Video, en el repo: https://github.com/Juxn89/docs-assistant/blob/main/docs/demo/docs-assistant-demo.mp4

## Texto base para propuestas

Para pegar y adaptar cuando un proyecto pida un chatbot o asistente con IA:

> Hola, [nombre]. Construí exactamente esto: un asistente que responde a los clientes con los documentos
> del negocio, muestra de dónde sale cada respuesta y, cuando no sabe, pasa el cliente a una persona por
> email. Puedes verlo funcionando en mi portafolio: https://www.juangomezb.com/es/projects/docs-assistant
> Lo medí con 54 preguntas de prueba: 95 % de
> respuestas con la fuente correcta y ninguna respuesta inventada, con un costo de IA de USD 0,33 por cada
> 1.000 preguntas.
>
> Para tu caso, [lo que pide el proyecto], lo adaptaría así: [2 o 3 líneas]. Antes de publicarlo lo
> probaríamos con preguntas reales de tus clientes, y dejaría límites de uso para que el gasto nunca te
> sorprenda.

---

## Cambios respecto al borrador del plan (§11)

- Se quitó "Pruébalo en vivo en juangomezb.com": la demo es el video (decisión del 16 oct 2026, plan §9).
- Se quitaron Next.js y Azure del stack: el panel y el despliegue no están hechos.
- El costo por respuesta pasa de la estimación (≈ USD 0,0004) al valor medido (USD 0,33 por 1.000
  preguntas).
- 21 oct 2026: se agregan el caso de estudio en juangomezb.com, con el video, y su enlace en el texto
  base para propuestas.
