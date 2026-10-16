import {ImageResponse} from 'next/og';
import type {ProjectMetric} from '@/lib/projects/types';

export const SHARE_IMAGE_SIZE = {width: 1200, height: 630};
export const SHARE_IMAGE_TYPE = 'image/png';

// The dark Forest Code palette from globals.css. ImageResponse cannot read CSS variables, so the values are repeated.
const COLORS = {
	background: '#0C1713',
	surface: '#172420',
	border: '#24413A',
	text: '#F0FDF4',
	muted: '#9CA3AF',
	accent: '#10B981',
	violet: '#A78BFA',
};

type ShareImageProps = {
	eyebrow: string;
	title: string;
	subtitle: string;
	metrics?: ProjectMetric[];
	footer: string;
};

/** The image link previews show (LinkedIn, WhatsApp, Slack, X). Geist Regular is next/og's bundled default font. */
export function renderShareImage({eyebrow, title, subtitle, metrics = [], footer}: ShareImageProps) {
	// With metrics the image has three bands to fit, so the heading and subtitle step down a size.
	const compact = metrics.length > 0;

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: compact ? '52px 72px' : '64px 72px',
					background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.background} 60%, #13241E 100%)`,
					color: COLORS.text,
				}}
			>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: compact ? 20 : 28}}>
						<div style={{width: 56, height: 6, borderRadius: 3, background: COLORS.accent}} />
						<div style={{fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: COLORS.accent}}>
							{eyebrow}
						</div>
					</div>
					<div style={{fontSize: compact ? 72 : title.length > 18 ? 76 : 92, lineHeight: 1.05, letterSpacing: -2, marginBottom: compact ? 16 : 24}}>
						{title}
					</div>
					<div style={{fontSize: compact ? 27 : 32, lineHeight: 1.35, color: COLORS.muted, maxWidth: 1056}}>{subtitle}</div>
				</div>

				{metrics.length > 0 && (
					<div style={{display: 'flex', gap: 20}}>
						{metrics.slice(0, 3).map((metric) => (
							<div
								key={metric.label}
								style={{
									display: 'flex',
									flexDirection: 'column',
									flex: 1,
									padding: '20px 24px',
									borderRadius: 18,
									border: `2px solid ${COLORS.border}`,
									background: COLORS.surface,
								}}
							>
								<div style={{fontSize: 44, color: COLORS.accent}}>{metric.value}</div>
								<div style={{fontSize: 20, lineHeight: 1.3, color: COLORS.muted, marginTop: 6}}>{metric.label}</div>
							</div>
						))}
					</div>
				)}

				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24}}>
					<div style={{color: COLORS.text}}>{footer}</div>
					<div style={{color: COLORS.violet}}>juangomezb.com</div>
				</div>
			</div>
		),
		SHARE_IMAGE_SIZE
	);
}
