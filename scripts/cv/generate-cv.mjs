// Builds public/resume/juan-gomez-cv-{en,es}.pdf from the site's experience (messages/<locale>.json)
// and scripts/cv/cv-content.mjs, so the CV and the site tell the same story.
// Run: npm run cv   (uses the Chromium that Playwright already installs for the e2e tests)
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import {cvContent} from './cv-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const escape = (value) =>
	String(value).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);

// Consecutive roles at the same company share one company heading.
function groupByCompany(jobs) {
	const groups = [];
	for (const job of jobs) {
		const last = groups.at(-1);
		if (last && last.company === job.company) last.roles.push(job);
		else groups.push({company: job.company, location: job.location, roles: [job]});
	}
	return groups;
}

function renderRole(job) {
	return `
		<div class="role">
			<div class="row"><span class="position">${escape(job.position)}</span><span class="period">${escape(job.period.replace(' - ', ' – '))}</span></div>
			<p class="desc">${escape(job.description)}</p>
			${job.achievements.length ? `<ul>${job.achievements.map((a) => `<li>${escape(a)}</li>`).join('')}</ul>` : ''}
		</div>`;
}

function renderHtml(locale, cv, jobs) {
	// Each item stays on one line; the row wraps between items, never inside one.
	const contact = [
		escape(cv.location),
		`<a href="mailto:${escape(cv.contact.email)}">${escape(cv.contact.email)}</a>`,
		...cv.contact.links.map((l) => `<a href="${escape(l.href)}">${escape(l.label)}</a>`),
	]
		.map((item) => `<span class="item">${item}</span>`)
		.join('<span class="sep">·</span>');

	return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>${escape(cv.name)} · CV</title>
<style>
	@page { size: A4; margin: 13mm 15mm 13mm 15mm; }
	* { box-sizing: border-box; }
	body { margin: 0; font-family: "Segoe UI", Arial, Helvetica, sans-serif; font-size: 9.4pt; line-height: 1.38; color: #1f2937; }
	a { color: inherit; text-decoration: none; }
	header h1 { margin: 0; font-size: 21pt; letter-spacing: 0.3px; color: #0f172a; }
	header .title { margin-top: 1px; font-size: 11pt; font-weight: 600; color: #047857; }
	header .contact { margin-top: 5px; font-size: 8.8pt; color: #374151; }
	header .item { white-space: nowrap; }
	header .sep { margin: 0 6px; color: #9ca3af; }
	h2 { margin: 12px 0 5px; padding-bottom: 2px; border-bottom: 1.4px solid #a7f3d0; font-size: 9.6pt; letter-spacing: 1.1px; text-transform: uppercase; color: #047857; }
	p { margin: 0; }
	.company { margin-top: 7px; break-after: avoid; }
	.company .row { font-size: 10.2pt; font-weight: 700; color: #0f172a; }
	.company .location { font-size: 8.8pt; font-weight: 400; color: #4b5563; }
	.role { margin-top: 3px; break-inside: avoid; }
	.row { display: flex; justify-content: space-between; gap: 12px; }
	.position { font-weight: 600; color: #5b21b6; }
	.period { white-space: nowrap; font-size: 8.8pt; color: #4b5563; }
	.desc { margin-top: 1px; }
	ul { margin: 2px 0 0; padding-left: 13px; }
	li { margin: 1px 0; }
	.note { margin-bottom: 3px; color: #4b5563; font-size: 8.8pt; }
	.projects li, .skills li { break-inside: avoid; }
	.skills { list-style: none; padding-left: 0; }
	b { color: #0f172a; }
</style>
</head>
<body>
	<header>
		<h1>${escape(cv.name)}</h1>
		<div class="title">${escape(cv.title)}</div>
		<div class="contact">${contact}</div>
	</header>

	<h2>${escape(cv.headings.summary)}</h2>
	<p>${escape(cv.summary)}</p>

	<h2>${escape(cv.headings.experience)}</h2>
	${groupByCompany(jobs)
		.map(
			(group) => `
		<section class="company">
			<div class="row"><span>${escape(group.company)}</span><span class="location">${escape(group.location)}</span></div>
		</section>
		${group.roles.map(renderRole).join('')}`
		)
		.join('')}

	<h2>${escape(cv.headings.projects)}</h2>
	<p class="note">${escape(cv.projectsNote)}</p>
	<ul class="projects">${cv.projects.map(([name, text]) => `<li><b>${escape(name)}</b>: ${escape(text)}</li>`).join('')}</ul>

	<h2>${escape(cv.headings.education)}</h2>
	<div class="row"><span><b>${escape(cv.education.degree)}</b>, ${escape(cv.education.school)}</span><span class="period">${escape(cv.education.period)}</span></div>

	<h2>${escape(cv.headings.skills)}</h2>
	<ul class="skills">${cv.skills.map(([group, items]) => `<li><b>${escape(group)}:</b> ${escape(items)}</li>`).join('')}</ul>

	<h2>${escape(cv.headings.languages)}</h2>
	<p>${escape(cv.languages)}</p>
</body>
</html>`;
}

const browser = await chromium.launch();
try {
	for (const locale of ['en', 'es']) {
		const messages = JSON.parse(await readFile(path.join(root, 'messages', `${locale}.json`), 'utf8'));
		const html = renderHtml(locale, cvContent[locale], messages.experience.jobs);
		const page = await browser.newPage();
		await page.setContent(html, {waitUntil: 'load'});
		const pdf = await page.pdf({format: 'A4', printBackground: true, preferCSSPageSize: true});
		await page.close();
		const target = path.join(root, 'public', 'resume', `juan-gomez-cv-${locale}.pdf`);
		await writeFile(target, pdf);
		const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
		console.log(`${path.relative(root, target)}: ${pages} page(s), ${pdf.length} bytes`);
	}
} finally {
	await browser.close();
}
