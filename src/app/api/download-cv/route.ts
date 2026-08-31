import {NextRequest, NextResponse} from 'next/server';

const CV_URLS = {
	en: 'https://ajzggfj0pyd8jm3a.public.blob.vercel-storage.com/resume/juan-gomez-cv-en.pdf',
	es: 'https://ajzggfj0pyd8jm3a.public.blob.vercel-storage.com/resume/juan-gomez-cv-es.pdf',
} as const;

export async function GET(request: NextRequest) {
	const locale = request.nextUrl.searchParams.get('locale') || 'en';

	if (locale !== 'en' && locale !== 'es') {
		return NextResponse.json({error: 'Invalid locale'}, {status: 400});
	}

	const cvUrl = CV_URLS[locale as keyof typeof CV_URLS];

	try {
		const response = await fetch(cvUrl);

		if (!response.ok) {
			return NextResponse.json({error: 'Failed to fetch CV'}, {status: response.status});
		}

		const buffer = await response.arrayBuffer();
		const filename = locale === 'es' ? 'juan-gomez-cv-es.pdf' : 'juan-gomez-cv-en.pdf';

		return new NextResponse(buffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Cache-Control': 'public, max-age=3600',
			},
		});
	} catch (error) {
		console.error('Error downloading CV:', error);
		return NextResponse.json({error: 'Internal server error'}, {status: 500});
	}
}
