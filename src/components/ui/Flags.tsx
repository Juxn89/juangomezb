import { FC, useEffect } from 'react';
import NextLink from 'next/link'
import { Avatar, Box, Link } from '@mui/material'
import { LanguageType } from '@common/types'
import { FLAGS_URL } from '@common/constants'
import Image from 'next/image';

interface IFlagsProps {
    locale: LanguageType
}

export const Flags: FC<IFlagsProps> = ({ locale }) => {

  return (
    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        {
            locale === 'en' &&
            (<NextLink href='/es/' passHref legacyBehavior>
                <Link>
                    <Image src={ FLAGS_URL.ES_FLAG } alt='Español' width= {30} height= {30} style={{ marginRight: '5px' }} title='Español'/>
                </Link>
            </NextLink>)
        }

        {
            locale === 'es' &&
            (<NextLink href='/en/' passHref legacyBehavior>
                <Link>
                    <Image src={ FLAGS_URL.EN_FLAG } alt='English'  width= {32} height= {32} title='English' style={{ borderRadius: '8px' }}/>
                </Link>
            </NextLink>)
        }
    </Box>
  )
}
