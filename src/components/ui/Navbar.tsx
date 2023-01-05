import { FC } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { Flags, SwitchTheme } from '@components/ui/';

export const Navbar: FC = () => {
  return (
    <AppBar>
        <Toolbar>            
            <Box flex={1}/>
            <SwitchTheme />
            <Flags locale='es'/>
        </Toolbar>
    </AppBar>
  )
}
