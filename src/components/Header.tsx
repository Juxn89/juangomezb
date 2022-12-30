import NextLink from 'next/link'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { Link } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'

export const Header = () => {
  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Typography variant='h5' component='h1'>Juan G&oacute;mez</Typography>

        <Box flex={1} />

        <Box>
          <NextLink href='/' legacyBehavior>
            <Link>
              Acerca de mi
            </Link>
          </NextLink>
        </Box>
        
        <Box flex={1} />

        <Box>
          <Image src='/assets/svg/flags/es.svg' alt='Español' width={30} height={30} />
          <Image src='/assets/svg/flags/gb.svg' alt='Inglés' width={30} height={30} />
        </Box>
      </Toolbar>
    </AppBar>
  )
}