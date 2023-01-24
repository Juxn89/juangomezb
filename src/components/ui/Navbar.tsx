import { FC } from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { Flags, SwitchTheme } from '@components/ui/';

export const Navbar: FC = () => {
  return (
    <AppBar sx={{ height: { xs: '40px', sx: '60px' }, minHeight: { xs: '40px', sx: '56px' } }}>
      <Toolbar sx={{ height: { xs: '40px', sx: '60px' }, minHeight: { xs: '40px', sx: '56px' } }}>
        <Typography sx={{ display: { xs: 'block', sm: 'none' } }} variant='h4' component='h1'>Juan Gómez</Typography>
        <Box flex={1}/>
        <SwitchTheme />
        <Flags />
      </Toolbar>
    </AppBar>
  )
}
