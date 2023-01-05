import { FC } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Flags } from '@components/ui/index';

export const Navbar: FC = () => {
  return (
    <AppBar>
        <Toolbar>            
            <Box flex={1}/>
            <Typography>Light/Dark mode</Typography>
            <Flags />
        </Toolbar>
    </AppBar>
  )
}
