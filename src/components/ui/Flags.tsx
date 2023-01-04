import React from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { Box, Link } from '@mui/material'

export const Flags = () => {
  return (
    <Box display='flex'>
        <NextLink href='/es/' passHref legacyBehavior>
            <Link>
                <Image src='/assets/svg/flags/es.svg' alt='Español' width={30} height={30} style={{ marginRight: '5px' }} title='Español'/>
            </Link>
        </NextLink>
        <NextLink href='/es/' passHref legacyBehavior>
            <Link>
                <Image src='/assets/svg/flags/gb.svg' alt='English' width={30} height={30} title='English' />
            </Link>
        </NextLink>
    </Box>
  )
}
