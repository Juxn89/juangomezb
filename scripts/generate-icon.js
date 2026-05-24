/**
 * Script para generar apple-touch-icon.png desde favicon.svg
 * 
 * Requisito: sharp (instalar con: npm install --save-dev sharp)
 * 
 * Uso: node scripts/generate-icon.js
 */

const fs = require('fs');
const path = require('path');

async function generateAppleTouchIcon() {
	try {
		// Intentar cargar sharp
		let sharp;
		try {
			sharp = require('sharp');
		} catch (error) {
			console.error('❌ Error: sharp no está instalado');
			console.log('\n📦 Instala sharp ejecutando:');
			console.log('   npm install --save-dev sharp');
			console.log('\nLuego vuelve a ejecutar este script.');
			process.exit(1);
		}

		const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
		const outputPath = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');

		console.log('🎨 Generando apple-touch-icon.png...');
		console.log(`📂 Origen: ${svgPath}`);
		console.log(`📂 Destino: ${outputPath}`);

		// Leer SVG
		const svgBuffer = fs.readFileSync(svgPath);

		// Convertir SVG a PNG de 180x180px
		await sharp(svgBuffer)
			.resize(180, 180, {
				fit: 'contain',
				background: { r: 255, g: 255, b: 255, alpha: 0 } // Fondo transparente
			})
			.png({
				quality: 100,
				compressionLevel: 9,
			})
			.toFile(outputPath);

		console.log('✅ apple-touch-icon.png generado exitosamente!');
		console.log(`📏 Tamaño: 180x180px`);
		console.log(`📍 Ubicación: /public/apple-touch-icon.png`);
		console.log('\n🎯 Próximo paso: Rebuild del proyecto (pnpm run build)');
	} catch (error) {
		console.error('❌ Error generando icon:', error.message);
		process.exit(1);
	}
}

generateAppleTouchIcon();
