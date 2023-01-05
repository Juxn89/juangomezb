import { FC } from 'react'
import NextLink from 'next/link'
import { Avatar, Box, Link } from '@mui/material'
import { FLAGS_URL } from '@common/constants'

export const Flags: FC = () => {
  return (
    <Box display='flex'>
        <NextLink href='/es/' passHref legacyBehavior>
            <Link>
                <Avatar src={ FLAGS_URL.ES_FLAG } alt='Español' sx={{ width: 30, height: 30 }} style={{ marginRight: '5px' }} title='Español'/>
            </Link>
        </NextLink>
        <NextLink href='/en/' passHref legacyBehavior>
            <Link>
                <Avatar src={ FLAGS_URL.EN_FLAG } alt='English' sx={{ width: 30, height: 30 }} title='English' />
            </Link>
        </NextLink>
    </Box>
  )
}
