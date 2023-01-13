import { FC } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { Flags, SwitchTheme } from '@components/ui/';

export const Navbar: FC = () => {
  return (
    <AppBar sx={{ height: { xs: '40px', sx: '60px' }, minHeight: { xs: '40px', sx: '56px' } }}>
        <Toolbar sx={{ height: { xs: '40px', sx: '60px' }, minHeight: { xs: '40px', sx: '56px' } }}>            
            <Box flex={1}/>
            <SwitchTheme />
            <Flags />
        </Toolbar>
    </AppBar>
  )
}
