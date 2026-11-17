// What the CV says beyond the site's experience section (messages/<locale>.json → experience.jobs).
// Keep it in step with the LinkedIn profile: same facts, same figures, no unsourced numbers.

const contact = {
	email: 'gb.jc@outlook.com',
	links: [
		{label: 'linkedin.com/in/jcgomez89', href: 'https://www.linkedin.com/in/jcgomez89/'},
		{label: 'github.com/Juxn89', href: 'https://github.com/Juxn89'},
		{label: 'juangomezb.com', href: 'https://www.juangomezb.com'},
		{label: 'dev.to/jgomezdev', href: 'https://dev.to/jgomezdev'},
	],
};

export const cvContent = {
	en: {
		name: 'Juan Gómez',
		title: 'Senior Software Engineer · .NET + Generative AI',
		location: 'Managua, Nicaragua (UTC-6) · Remote',
		contact,
		headings: {
			summary: 'Summary',
			experience: 'Experience',
			projects: 'Selected AI projects',
			education: 'Education',
			skills: 'Skills',
			languages: 'Languages',
		},
		summary:
			'Senior Software Engineer with 15+ years building .NET and React systems, now shipping generative AI that is measured: large language model (LLM) applications, Retrieval-Augmented Generation (RAG) and AI agents, each with evals, guardrails and a known cost per request. Technical lead at The Stepstone Group for recruitment platforms across 6 brands in Europe, Central America and the Caribbean, where I co-built an AI assistant for job ads that is in production. Open to remote Senior Software Engineer and AI Engineer roles, full-time or freelance.',
		projectsNote: 'Personal projects, public code at github.com/Juxn89; case studies at juangomezb.com.',
		projects: [
			['booking-agent', 'Appointments booked by chat; 28/28 test conversations ended as expected; the assistant never confirms a booking, the customer does with a button; USD 0.0024 per conversation. .NET, Claude, PostgreSQL.'],
			['docs-assistant', 'RAG support assistant; the right document in the top 5 results for 98% of a 54-question bilingual eval (hit@5); 12/12 prompt-injection attacks resisted; USD 0.33 per 1,000 questions. .NET, pgvector, Claude.'],
			['invoice-extractor', 'Invoices read by AI and checked by accounting rules; 0 of 42 false auto-approvals; USD 0.00065 per document. .NET, Claude, .NET Aspire.'],
			['data-chat', 'Plain-language questions over sales data; 75/75 questions answered with the right figures; the AI never writes SQL; USD 0.00058 per question. .NET, Claude, PostgreSQL.'],
			['talent-mcp', 'MCP (Model Context Protocol) server in C# that gives AI agents 6 typed recruiting tools, each behind its own OAuth 2.1 scope (Keycloak); 5 test levels gate every merge; published on NuGet. .NET 10, OpenTelemetry.'],
		],
		education: {
			degree: 'Bachelor of Engineering, Systems Engineering',
			school: 'Universidad Centroamericana (UCA), Managua',
			period: '2007 – 2011',
		},
		skills: [
			['AI', 'LLM applications, RAG, AI agents, evals, guardrails, Claude (Anthropic), MCP (Model Context Protocol), pgvector, Microsoft.Extensions.AI, prompt engineering, GitHub Copilot, Claude Code'],
			['Backend', 'C#, .NET, ASP.NET Core, Entity Framework Core, .NET Aspire, REST APIs, microservices, backend for frontend (BFF)'],
			['Frontend', 'React, Next.js, TypeScript, JavaScript, microfrontends, ExtJS'],
			['Cloud & data', 'AWS (Lambda, SQS), Docker, CI/CD (continuous integration and delivery), PostgreSQL, SQL Server'],
			['Practices', 'Software architecture, technical leadership, agile, unit and integration testing, SOLID principles, Clean Code'],
			['Courses and personal projects', 'Azure, Node.js, NestJS, GraphQL, Angular, MongoDB'],
		],
		languages: 'Spanish (native), English (B2, professional working proficiency)',
	},
	es: {
		name: 'Juan Gómez',
		title: 'Ingeniero de Software Senior · .NET + IA Generativa',
		location: 'Managua, Nicaragua (UTC-6) · Remoto',
		contact,
		headings: {
			summary: 'Resumen',
			experience: 'Experiencia',
			projects: 'Proyectos de IA destacados',
			education: 'Formación',
			skills: 'Habilidades',
			languages: 'Idiomas',
		},
		summary:
			'Ingeniero de Software Senior con más de 15 años construyendo sistemas en .NET y React, y ahora llevando a producción IA generativa que se mide: aplicaciones con modelos de lenguaje de gran tamaño (LLM), generación aumentada por recuperación (RAG) y agentes de IA, cada una con evaluaciones (evals), salvaguardas (guardrails) y un costo por consulta conocido. Líder técnico en The Stepstone Group de plataformas de reclutamiento para 6 marcas en Europa, Centroamérica y el Caribe, donde co-desarrollé, en un equipo de dos personas, un asistente de IA para ofertas de empleo que está en producción. Abierto a roles remotos de Ingeniero de Software Senior e Ingeniero de IA, a tiempo completo o como freelance.',
		projectsNote: 'Proyectos personales, con el código público en github.com/Juxn89; casos de estudio en juangomezb.com.',
		projects: [
			['booking-agent', 'Citas reservadas por chat; 28 de 28 conversaciones de prueba terminaron como se esperaba; el asistente nunca confirma una reserva, la confirma el cliente con un botón; USD 0,0024 por conversación. .NET, Claude, PostgreSQL.'],
			['docs-assistant', 'Asistente de soporte con RAG; el documento correcto entre los 5 primeros resultados en el 98 % de una evaluación bilingüe de 54 preguntas (hit@5), y 12 de 12 ataques de prompt injection resistidos; USD 0,33 por cada 1.000 preguntas. .NET, pgvector, Claude.'],
			['invoice-extractor', 'Facturas leídas por IA y revisadas con reglas contables; 0 de 42 aprobaciones automáticas falsas; USD 0,00065 por documento. .NET, Claude, .NET Aspire.'],
			['data-chat', 'Preguntas en lenguaje natural sobre datos de ventas; 75 de 75 respondidas con la cifra correcta, sin que la IA escriba SQL; USD 0,00058 por pregunta. .NET, Claude, PostgreSQL.'],
			['talent-mcp', 'Servidor MCP (Model Context Protocol) en C# que da a los agentes de IA 6 herramientas tipadas de reclutamiento, cada una con su propio scope de OAuth 2.1 (Keycloak); 5 niveles de pruebas bloquean cada merge; publicado en NuGet. .NET 10, OpenTelemetry.'],
		],
		education: {
			degree: 'Ingeniería en Sistemas (título de ingeniero)',
			school: 'Universidad Centroamericana (UCA), Managua',
			period: '2007 – 2011',
		},
		skills: [
			['IA', 'Aplicaciones con LLM, RAG, agentes de IA, evaluaciones (evals), salvaguardas (guardrails), Claude (Anthropic), MCP (Model Context Protocol), pgvector, Microsoft.Extensions.AI, prompt engineering, GitHub Copilot, Claude Code'],
			['Backend', 'C#, .NET, ASP.NET Core, Entity Framework Core, .NET Aspire, APIs REST, microservicios, backend for frontend (BFF)'],
			['Frontend', 'React, Next.js, TypeScript, JavaScript, microfrontends, ExtJS'],
			['Nube y datos', 'AWS (Lambda, SQS), Docker, CI/CD (integración y entrega continuas), PostgreSQL, SQL Server'],
			['Prácticas', 'Arquitectura de software, liderazgo técnico, metodologías ágiles, pruebas unitarias y de integración, principios SOLID, Clean Code'],
			['Cursos y proyectos personales', 'Azure, Node.js, NestJS, GraphQL, Angular, MongoDB'],
		],
		languages: 'Español (nativo), inglés (B2, competencia profesional)',
	},
};
