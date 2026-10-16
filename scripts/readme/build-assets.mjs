// Generates the README artwork in docs/readme/: hero banner, stats strip, feature icons (SVG, light and
// dark) and the device showcase (PNG, composed from live screenshots with Playwright).
//
//   node scripts/readme/build-assets.mjs            # SVGs + showcase from https://www.juangomezb.com
//   node scripts/readme/build-assets.mjs --svg-only
//
// Everything is plain SVG/PNG because GitHub renders README images through <img>: no external fonts,
// no scripts. SVG CSS animations do run there, and they respect prefers-reduced-motion.
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as Lucide from 'lucide-react';

const out = fileURLToPath(new URL('../../docs/readme/', import.meta.url));
const site = 'https://www.juangomezb.com';
await mkdir(out, {recursive: true});

// Forest Code palette (src/app/globals.css).
const palette = {
	emerald: '#10b981',
	emeraldDeep: '#047857',
	violet: '#7c3aed',
	violetSoft: '#a78bfa',
	amber: '#f59e0b',
	amberSoft: '#fbbf24',
};

const themes = {
	dark: {bg: '#0b1110', panel: '#111a18', border: '#1f2e2a', text: '#f3f4f6', muted: '#9ca3af', grid: '#ffffff', gridOpacity: 0.035, orb: 0.22},
	light: {bg: '#fbfaf6', panel: '#ffffff', border: '#e5e7eb', text: '#111827', muted: '#4b5563', grid: '#047857', gridOpacity: 0.06, orb: 0.14},
};

const sans = `'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`;
const mono = `'Cascadia Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`;

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function defs(t) {
	return `
	<linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
		<stop offset="0" stop-color="${palette.emerald}"/>
		<stop offset="0.55" stop-color="${palette.violet}"/>
		<stop offset="1" stop-color="${palette.amber}"/>
	</linearGradient>
	<radialGradient id="orbGreen"><stop offset="0" stop-color="${palette.emerald}" stop-opacity="${t.orb}"/><stop offset="1" stop-color="${palette.emerald}" stop-opacity="0"/></radialGradient>
	<radialGradient id="orbViolet"><stop offset="0" stop-color="${palette.violet}" stop-opacity="${t.orb}"/><stop offset="1" stop-color="${palette.violet}" stop-opacity="0"/></radialGradient>
	<radialGradient id="orbAmber"><stop offset="0" stop-color="${palette.amber}" stop-opacity="${t.orb * 0.6}"/><stop offset="1" stop-color="${palette.amber}" stop-opacity="0"/></radialGradient>
	<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
		<path d="M32 0H0V32" fill="none" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>
	</pattern>`;
}

// ── Hero banner ──────────────────────────────────────────────────────────────────────────────────
function hero(name) {
	const t = themes[name];
	const W = 1280;
	const H = 420;
	const chips = ['.NET', 'Azure', 'TypeScript', 'Next.js', 'AI · RAG'];
	let chipX = 72;
	const chipSvg = chips
		.map((chip) => {
			const w = chip.length * 9.5 + 32;
			const svg = `<g transform="translate(${chipX} 318)"><rect width="${w}" height="34" rx="17" fill="${t.panel}" stroke="${t.border}"/><text x="${w / 2}" y="22.5" text-anchor="middle" font-family="${sans}" font-size="15" font-weight="600" fill="${t.text}">${escape(chip)}</text></g>`;
			chipX += w + 10;
			return svg;
		})
		.join('');

	// whoami.ts — one line per entry, syntax colored, revealed one after another.
	const k = palette.violetSoft;
	const s = palette.emerald;
	const p = t === themes.dark ? '#e5e7eb' : '#e5e7eb';
	const c = '#6b7280';
	const lines = [
		[[c, '// whoami.ts']],
		[[k, 'export const '], [p, 'juan'], [p, ' = {']],
		[[p, '  role: '], [s, "'Senior Software Engineer'"], [p, ',']],
		[[p, '  stack: ['], [s, "'.NET'"], [p, ', '], [s, "'TypeScript'"], [p, ', '], [s, "'Azure'"], [p, '],']],
		[[p, '  focus: '], [s, "'AI that ships to production'"], [p, ',']],
		[[p, '  experience: '], [palette.amberSoft, "'15+ years'"], [p, ',']],
		[[p, '};']],
	];
	const code = lines
		.map(
			(line, i) =>
				`<text class="line" style="animation-delay:${0.25 + i * 0.32}s" x="28" y="${84 + i * 27}" font-family="${mono}" font-size="15.5" xml:space="preserve">${line
					.map(([color, text]) => `<tspan fill="${color}">${escape(text)}</tspan>`)
					.join('')}</text>`,
		)
		.join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">Juan Gómez — Senior Software Engineer</title>
<desc id="desc">.NET, cloud architecture and AI. Portfolio source code for juangomezb.com.</desc>
<style>
	.line { opacity: 0; animation: reveal .45s ease-out forwards; }
	.cursor { animation: blink 1.1s steps(1) infinite; }
	.orb { animation: drift 14s ease-in-out infinite alternate; }
	@keyframes reveal { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
	@keyframes blink { 50% { opacity: 0; } }
	@keyframes drift { to { transform: translate(24px, -12px); } }
	@media (prefers-reduced-motion: reduce) { .line { animation: none; opacity: 1; } .cursor, .orb { animation: none; } }
</style>
<defs>${defs(t)}
	<clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
	<linearGradient id="cardEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.emerald}" stop-opacity=".7"/><stop offset="1" stop-color="${palette.violet}" stop-opacity=".7"/></linearGradient>
</defs>
<g clip-path="url(#frame)">
	<rect width="${W}" height="${H}" fill="${t.bg}"/>
	<rect width="${W}" height="${H}" fill="url(#grid)"/>
	<circle class="orb" cx="140" cy="60" r="320" fill="url(#orbGreen)"/>
	<circle class="orb" cx="1180" cy="400" r="360" fill="url(#orbViolet)" style="animation-delay:-7s"/>
	<circle cx="760" cy="40" r="220" fill="url(#orbAmber)"/>
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="28" fill="none" stroke="${t.border}"/>

<g transform="translate(72 72)">
	<rect width="262" height="32" rx="16" fill="${t.panel}" stroke="${t.border}"/>
	<circle cx="20" cy="16" r="5" fill="${palette.emerald}"><animate attributeName="opacity" values="1;.35;1" dur="2.4s" repeatCount="indefinite"/></circle>
	<text x="34" y="21" font-family="${sans}" font-size="13.5" font-weight="600" letter-spacing=".08em" fill="${t.muted}">PORTFOLIO · SOURCE CODE</text>
</g>
<text x="68" y="190" font-family="${sans}" font-size="78" font-weight="800" letter-spacing="-.02em" fill="url(#brand)">Juan Gómez</text>
<text x="72" y="236" font-family="${sans}" font-size="28" font-weight="600" fill="${t.text}">Senior Software Engineer</text>
<text x="72" y="276" font-family="${sans}" font-size="18" fill="${t.muted}">Scalable .NET systems, cloud architecture and AI that ships.</text>
${chipSvg}

<g transform="translate(752 70)">
	<rect width="460" height="280" rx="18" fill="#0d1513" stroke="url(#cardEdge)" stroke-width="1.5"/>
	<circle cx="26" cy="26" r="6" fill="#f87171"/><circle cx="46" cy="26" r="6" fill="#fbbf24"/><circle cx="66" cy="26" r="6" fill="#34d399"/>
	<text x="434" y="31" text-anchor="end" font-family="${mono}" font-size="12.5" fill="#6b7280">~/juangomezb</text>
	<line x1="0" y1="50" x2="460" y2="50" stroke="#1f2e2a"/>
	${code}
	<rect class="cursor" x="48" y="${84 + 6 * 27 - 15}" width="9" height="19" rx="1.5" fill="${palette.emerald}"/>
</g>
</svg>
`;
}

// ── Stats strip ──────────────────────────────────────────────────────────────────────────────────
function stats(name) {
	const t = themes[name];
	const W = 1280;
	const H = 132;
	const items = [
		['15+', 'years building software'],
		['500K+', 'users reached by my work'],
		['EN · ES', 'every page, both languages'],
		['0', 'UI kits — all components custom'],
	];
	const col = W / items.length;
	const cells = items
		.map(
			([value, label], i) => `
	<g transform="translate(${col * i + col / 2} 0)">
		<text y="66" text-anchor="middle" font-family="${sans}" font-size="40" font-weight="800" fill="url(#brand)">${escape(value)}</text>
		<text y="98" text-anchor="middle" font-family="${sans}" font-size="16" fill="${t.muted}">${escape(label)}</text>
	</g>${i > 0 ? `<line x1="${col * i}" y1="34" x2="${col * i}" y2="102" stroke="${t.border}"/>` : ''}`,
		)
		.join('');
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="15+ years building software. 500K+ users reached. Every page in English and Spanish. No UI kits: all components custom.">
<defs>${defs(t)}</defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="22" fill="${t.panel}" stroke="${t.border}"/>
${cells}
</svg>
`;
}

// ── Feature icons: Lucide glyphs (ISC) on a brand-gradient tile, legible on both themes ──────────
function icon(component, from, to) {
	const glyph = renderToStaticMarkup(createElement(component, {size: 24, color: '#ffffff', strokeWidth: 2}))
		.replace(/^<svg[^>]*>/, '')
		.replace(/<\/svg>$/, '');
	return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="56" height="56" rx="16" fill="url(#g)"/>
<rect x=".75" y=".75" width="54.5" height="54.5" rx="15.25" fill="none" stroke="#ffffff" stroke-opacity=".18" stroke-width="1.5"/>
<g transform="translate(16 16)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
</svg>
`;
}

const icons = {
	bilingual: [Lucide.Languages, palette.emeraldDeep, palette.emerald],
	theme: [Lucide.SunMoon, palette.violet, palette.violetSoft],
	blog: [Lucide.Newspaper, '#b45309', palette.amberSoft],
	projects: [Lucide.FolderGit2, palette.emeraldDeep, palette.violet],
	cv: [Lucide.FileDown, palette.violet, palette.amber],
	security: [Lucide.ShieldCheck, '#065f46', palette.emerald],
	mobile: [Lucide.Smartphone, '#6d28d9', palette.emerald],
	seo: [Lucide.Search, '#b45309', palette.violet],
};

// ── Divider ──────────────────────────────────────────────────────────────────────────────────────
const divider = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="24" viewBox="0 0 1280 24" aria-hidden="true">
<defs><linearGradient id="d" x1="0" x2="1"><stop offset="0" stop-color="${palette.emerald}" stop-opacity="0"/><stop offset=".25" stop-color="${palette.emerald}"/><stop offset=".5" stop-color="${palette.violet}"/><stop offset=".75" stop-color="${palette.amber}"/><stop offset="1" stop-color="${palette.amber}" stop-opacity="0"/></linearGradient></defs>
<rect y="11" width="1280" height="2" rx="1" fill="url(#d)"/>
<circle cx="640" cy="12" r="5" fill="${palette.violet}"/>
</svg>
`;

for (const name of ['dark', 'light']) {
	await writeFile(`${out}hero-${name}.svg`, hero(name));
	await writeFile(`${out}stats-${name}.svg`, stats(name));
}

for (const [name, [component, from, to]] of Object.entries(icons)) {
	await writeFile(`${out}icon-${name}.svg`, icon(component, from, to));
}

await writeFile(`${out}divider.svg`, divider);

if (process.argv.includes('--svg-only')) {
	console.log(`SVGs written to ${out}`);
	process.exit(0);
}

// ── Showcase: live screenshots composed into a browser and a phone frame ───────────────────────
const {chromium} = await import('@playwright/test');
const browser = await chromium.launch();

async function capture(path, options, role) {
	const page = await browser.newPage(options);
	await page.goto(site + path, {waitUntil: 'networkidle'});
	await page.waitForFunction((r) => [...document.querySelectorAll('h2')].some((h) => h.textContent.trim() === r), role, {timeout: 60_000});
	await page.waitForTimeout(300);
	const buffer = await page.screenshot();
	await page.close();
	return `data:image/png;base64,${buffer.toString('base64')}`;
}

for (const name of ['dark', 'light']) {
	const t = themes[name];
	const desktop = await capture('/en', {viewport: {width: 1280, height: 800}, colorScheme: name}, 'AI Developer');
	const phone = await capture('/es', {viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, colorScheme: name}, 'Desarrollador IA');

	const html = `<!doctype html><html><head><meta charset="utf-8"><style>
		* { box-sizing: border-box; margin: 0; }
		body { width: 1600px; height: 980px; background: ${t.bg}; font-family: ${sans}; overflow: hidden; position: relative; }
		.glow { position: absolute; border-radius: 50%; filter: blur(90px); }
		.g1 { width: 640px; height: 640px; left: -160px; top: -200px; background: ${palette.emerald}; opacity: ${name === 'dark' ? 0.28 : 0.18}; }
		.g2 { width: 720px; height: 720px; right: -200px; bottom: -260px; background: ${palette.violet}; opacity: ${name === 'dark' ? 0.32 : 0.16}; }
		.window { position: absolute; left: 110px; top: 90px; width: 1180px; border-radius: 18px; overflow: hidden; background: ${t.panel};
			border: 1px solid ${t.border}; box-shadow: 0 40px 90px rgba(0,0,0,${name === 'dark' ? 0.55 : 0.18}); }
		.bar { height: 46px; display: flex; align-items: center; gap: 8px; padding: 0 18px; border-bottom: 1px solid ${t.border}; }
		.dot { width: 12px; height: 12px; border-radius: 50%; }
		.url { margin-left: 22px; flex: 0 0 420px; height: 28px; border-radius: 8px; background: ${t.bg}; border: 1px solid ${t.border};
			color: ${t.muted}; font-size: 14px; display: flex; align-items: center; padding: 0 12px; gap: 8px; }
		.lock { color: ${palette.emerald}; }
		.window img { display: block; width: 1180px; }
		.phone { position: absolute; right: 120px; bottom: 60px; width: 330px; height: 690px; border-radius: 52px; background: #0a0a0a;
			padding: 12px; box-shadow: 0 40px 90px rgba(0,0,0,.45), 0 0 0 2px #2a2a2a; }
		.phone img { width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 42px; display: block; }
		.notch { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); width: 96px; height: 26px; border-radius: 14px; background: #0a0a0a; }
	</style></head><body>
		<div class="glow g1"></div><div class="glow g2"></div>
		<div class="window">
			<div class="bar"><span class="dot" style="background:#f87171"></span><span class="dot" style="background:#fbbf24"></span><span class="dot" style="background:#34d399"></span>
				<span class="url"><span class="lock">🔒</span>juangomezb.com/en</span></div>
			<img src="${desktop}">
		</div>
		<div class="phone"><img src="${phone}"><span class="notch"></span></div>
	</body></html>`;

	const page = await browser.newPage({viewport: {width: 1600, height: 980}, deviceScaleFactor: 1});
	await page.setContent(html, {waitUntil: 'load'});
	await page.screenshot({path: `${out}showcase-${name}.png`});
	await page.close();
}

await browser.close();
console.log(`README assets written to ${out}`);
