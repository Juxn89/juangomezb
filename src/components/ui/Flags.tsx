import { FC, } from 'react';
import NextLink from 'next/link'
import { Box, Link } from '@mui/material'
import { LanguageType } from '@common/types'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslationsLabels } from '@hooks/useTranslationsLabels';

export const Flags: FC = () => {
  const { locale, defaultLocale, pathname } = useRouter()
  const {  flag } = useTranslationsLabels(locale as LanguageType)

  return (
    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <NextLink 
        href={ pathname }
        passHref 
        legacyBehavior
        locale={ locale === defaultLocale ? 'es' : defaultLocale }
      >
        <Link>
          <Image src={ flag.url } alt={ flag.title } width= {32} height= {32} title={ flag.title } style={{ borderRadius: '8px' }}/> 
        </Link>
      </NextLink>
    </Box>
  )
}
