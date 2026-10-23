# Ficha Workana · `talent-mcp`

> Ficha para el portafolio de Workana. Escrita el 20 oct 2026 a partir del README, los ADR y el
> changelog del repo ([github.com/Juxn89/talent-mcp](https://github.com/Juxn89/talent-mcp), release `v1.1.0`
> del 16 sep 2026). Es un proyecto ya terminado: el plan original vive en el propio repo
> (`docs/plans/a2-talent-mcp.md`), no en esta carpeta.
>
> **Antes de publicar:** revisar en el formulario de Workana el límite de caracteres de cada campo y los
> nombres exactos de las habilidades. Las capturas salen del servidor real con sus datos de ejemplo, el
> 20 oct 2026, usando MCP Inspector 2.9.0 como cliente.

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
| Título | Conecta tu sistema a asistentes de IA como Claude, con permisos por acción y confirmación antes de borrar (105 caracteres) |
| Habilidades (5) | .Net Core · Inteligencia Artificial · C# · PostgreSQL · Docker |
| Fecha de finalización | 10-2026 |
| Imagen de portada | `portada.jpg`: la confirmación que pide el servidor antes de rechazar a un candidato |
| Imágenes de galería, en este orden | `galeria-1.jpg`: las herramientas que el servidor ofrece al agente<br>`galeria-2.jpg`: un puntaje explicable, con su desglose |
| Archivos (PDF) | Ninguno |

**Descripción** (1118 caracteres), para pegar tal cual:

```text
Un servidor MCP (Model Context Protocol, el estándar para conectar asistentes de IA a sistemas reales) que deja a agentes como Claude usar tu sistema con reglas claras: qué pueden leer, qué pueden modificar y quién confirma antes de borrar.

Lo construí para un dominio donde los errores cuestan caro, el reclutamiento: buscar vacantes, puntuar candidatos, extraer habilidades de un CV y rechazar candidatos.

- Permisos por herramienta con OAuth 2.1: un agente con permiso de lectura no puede rechazar a nadie.
- Confirmación explícita antes de cualquier acción destructiva.
- Puntajes explicables y deterministas, con su desglose y sin costo de IA.
- Trabajos largos en segundo plano que sobreviven a un reinicio del servidor.
- Cada llamada del agente queda trazada hasta la base de datos (OpenTelemetry).
- Funciona con Claude Code y Claude Desktop; se publica en NuGet y como contenedor.

Se adapta a tu CRM, ERP, base de datos o API interna, con tu proveedor de identidad.

Stack: C# y .NET 10, ASP.NET Core, PostgreSQL, Keycloak, OpenTelemetry.
Caso de estudio: https://www.juangomezb.com/es/projects/talent-mcp
```

`.Net Core` va en todos los proyectos con ese nombre exacto, el mismo de las habilidades principales del
perfil, para que cuente en su columna "Proyectos trabajados"; lo mismo `React.js` donde hay web en React.
Si alguna otra no aparece en el catálogo, se cambia por la más cercana.

## Título

**Conecta tu sistema a asistentes de IA como Claude, con permisos por acción y confirmación antes de
borrar**

Versión corta, si el campo es limitado:
**Servidor MCP en C# para que agentes de IA usen tu sistema de forma segura**

## Descripción

**El problema.** Los asistentes de IA (Claude, Copilot y otros) ya pueden usar herramientas: buscar en tu
base de datos, crear registros, ejecutar acciones. El estándar para conectarlos es el **Model Context
Protocol (MCP)**. Pero conectar un agente a un sistema real abre preguntas serias: ¿qué puede leer, qué
puede modificar, quién confirma antes de borrar algo y cómo se audita lo que hizo?

**La solución.** Un servidor MCP que expone tu sistema a los agentes de IA como un conjunto de
herramientas con reglas claras. Lo construí para un dominio donde los errores cuestan caro, el
reclutamiento: buscar vacantes, puntuar candidatos, extraer habilidades de un CV y rechazar candidatos.

- **Permisos por herramienta.** Leer, escribir y borrar son permisos distintos (OAuth 2.1). Un agente con
  permiso de lectura no puede rechazar a un candidato, y los tests lo verifican.
- **Confirmación antes de acciones destructivas.** Rechazar a un candidato no ocurre en la primera
  llamada: el servidor pide confirmación explícita. Si el cliente no puede preguntar, toma un camino
  seguro en vez de fallar.
- **Resultados explicables y sin costo de IA.** La puntuación de un candidato es un cálculo determinista
  con su desglose, no una respuesta de un modelo: siempre da lo mismo, se puede auditar y no consume
  créditos de IA.
- **Trabajo largo que sobrevive a reinicios.** Puntuar una lista grande de candidatos corre en segundo
  plano, guardado en PostgreSQL. Si el servidor se reinicia, el trabajo sigue ahí.
- **Todo queda registrado.** Cada llamada del agente genera una traza que llega hasta cada consulta a
  la base de datos, y métricas por herramienta (latencia, errores, tareas en curso), con OpenTelemetry,
  Jaeger y Grafana.
- **Funciona con Claude Code y Claude Desktop**, instalado como herramienta de .NET, o como contenedor
  para servirlo por HTTP.

**Qué incluye un proyecto así para tu negocio:**
- Un servidor MCP sobre tu sistema (CRM, ERP, base de datos propia o una API interna), con las acciones
  que el agente puede hacer y las que no.
- Permisos por acción integrados con tu proveedor de identidad (Keycloak, Microsoft Entra, Auth0 u otro
  que hable OAuth).
- Confirmación obligatoria antes de cualquier acción que borre o modifique.
- Trazas y métricas para auditar qué hizo cada agente y cuándo.
- La instalación en los clientes de IA que usa tu equipo.

## Detalle técnico (para el cliente que lo pida)

- **Stack:** C# 14 sobre .NET 10, ASP.NET Core, EF Core con PostgreSQL, Keycloak, OpenTelemetry. Licencia
  Apache 2.0.
- **Protocolo:** implementa la revisión **2026-07-28** de MCP, la que eliminó las sesiones. Es HTTP sin
  estado, así que cualquier réplica atiende cualquier petición. La paginación viaja en *handles* firmados
  y con vencimiento.
- **Herramientas:** 6 tipadas (`search_jobs`, `get_job`, `extract_skills`, `score_candidate_fit`,
  `reject_candidate`, `bulk_score_shortlist`), compartidas por dos hosts: un servidor HTTP publicado como
  imagen de contenedor y un host stdio publicado como `dotnet tool`.
- **Arquitectura:** Clean Architecture, con la regla de dependencias verificada en CI. 7 ADR documentan
  cada decisión, incluido lo que se probó y se descartó.
- **Calidad:** cinco niveles de tests bloquean cada merge: reglas de arquitectura, dominio, herramientas
  en memoria, conformidad con el protocolo y pruebas de punta a punta con OAuth y PostgreSQL reales.
- **Rendimiento:** el arranque en frío del `dotnet tool` instalado, medido en CI, es de 323 ms.
- **Publicado:** en NuGet, como librería reutilizable (`Talent.Mcp.Toolkit`) y como herramienta
  (`Talent.Mcp.Server`), con 771 descargas entre ambos al 20 oct 2026. También como imagen en GHCR.

## Habilidades sugeridas

C# · .NET · Inteligencia Artificial · API REST · OAuth · PostgreSQL · Docker · Integración de APIs

(Elegir de la lista de Workana las que existan con ese nombre.)

## Archivos adjuntos

Todos en `talent-mcp/docs/demo/`, en 2560×1600 (el doble de 1280×800). Son capturas del servidor real con
sus datos de ejemplo, usando [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 2.9.0,
el cliente oficial de depuración del protocolo, como si fuera el agente.

| Orden | Archivo | Pie de foto sugerido |
|---|---|---|
| 1 | `03-confirmacion-antes-de-rechazar.png` | Antes de una acción que no se puede deshacer, el servidor pide confirmación |
| 2 | `02-puntaje-explicable.png` | Un puntaje explicable: 85/100, con el motivo de cada componente |
| 3 | `01-herramientas-para-el-agente.png` | Tu sistema, disponible para un agente de IA como herramientas con reglas |
| 4 | Imagen del caso de estudio | Servidor MCP en C# para agentes de IA. Se genera en `https://www.juangomezb.com/es/projects/talent-mcp/opengraph-image/project` |

La primera imagen es la que más se ve en el listado: por eso va la confirmación, que es lo que más
tranquiliza a un cliente que piensa en dejar que un agente toque sus datos.

**Lo que no se usó, y por qué:** el dashboard de Grafana y las trazas de Jaeger. Con el tráfico de una
demo, el dashboard muestra una nota técnica, una curva corta y un panel sin datos. Las trazas, al momento
de capturar, tenían solo dos spans, porque la base de datos no estaba instrumentada. Eso se corrigió el
21 oct 2026 ([talent-mcp#13](https://github.com/Juxn89/talent-mcp/issues/13)): hoy una búsqueda es una
traza de 5 spans que llega a las consultas, así que una captura de Jaeger podría sumarse más adelante.

## Enlaces

- Caso de estudio: https://www.juangomezb.com/es/projects/talent-mcp
- Código: https://github.com/Juxn89/talent-mcp
- NuGet: https://www.nuget.org/packages/Talent.Mcp.Server · https://www.nuget.org/packages/Talent.Mcp.Toolkit

## Texto base para propuestas

Para pegar y adaptar cuando un proyecto pida conectar un sistema a IA, crear un agente con acceso a datos
propios o desarrollar un servidor MCP:

> Hola, [nombre]. Construí un servidor MCP en C# que conecta un sistema real a asistentes de IA como
> Claude, con permisos distintos para leer, escribir y borrar, confirmación obligatoria antes de cualquier
> acción destructiva y trazas de todo lo que hace el agente. Está publicado en NuGet y el código es
> público: https://www.juangomezb.com/es/projects/talent-mcp
>
> Para tu caso, [lo que pide el proyecto], expondría [2 o 3 acciones concretas] como herramientas, con
> [qué permisos] y [qué confirmaciones]. Antes de conectarlo a producción lo probaríamos con tu equipo en
> un entorno de prueba.

---

## Cifras y de dónde salen

| Cifra | Fuente |
|---|---|
| 6 herramientas, cada una con su scope OAuth | README, sección *The tools* |
| 5 niveles de tests que bloquean el merge | README, sección *Testing* |
| 323 ms de arranque en frío del `dotnet tool` | README, sección *Benchmarks*: job `startup-benchmark` de CI |
| 7 ADR | `docs/adr/` en el repo |
| 771 descargas en NuGet (447 de la librería, 324 de la herramienta) | API de búsqueda de NuGet, consultada el 20 oct 2026. Incluye descargas automáticas de mirrors y de CI: es un indicador de que está publicado, no de usuarios |
| El Tasks store sobrevive a un reinicio de la base de datos | `CHANGELOG.md`, versión 1.1.0 |
