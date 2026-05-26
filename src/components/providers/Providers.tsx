'use client';

import {NextIntlClientProvider} from 'next-intl';
import {ThemeProvider} from '@/lib/context/theme-context';
import type {ReactNode} from 'react';

type ProvidersProps = {
	children: ReactNode;
	messages: any;
	locale: string;
};

export function Providers({children, messages, locale}: ProvidersProps) {
	return (
		<ThemeProvider>
			<NextIntlClientProvider 
				messages={messages} 
				locale={locale}
				timeZone="America/Managua"
			>
				{children}
			</NextIntlClientProvider>
		</ThemeProvider>
	);
}
