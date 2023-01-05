import { FC } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { Avatar, Box, Link } from '@mui/material'

export const Flags: FC = () => {
  return (
    <Box display='flex'>
        <NextLink href='/es/' passHref legacyBehavior>
            <Link>
                <Avatar src='/assets/svg/flags/es.svg' alt='Español' sx={{ width: 30, height: 30 }} style={{ marginRight: '5px' }} title='Español'/>
            </Link>
        </NextLink>
        <NextLink href='/es/' passHref legacyBehavior>
            <Link>
                <Avatar src='/assets/svg/flags/gb.svg' alt='English' sx={{ width: 30, height: 30 }} title='English' />
            </Link>
        </NextLink>
    </Box>
  )
}
