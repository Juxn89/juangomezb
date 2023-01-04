import React from 'react'
import { AppBar, Toolbar, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Flags } from '@components/ui/index';

export const Navbar = () => {
  return (
    <AppBar>
        <Toolbar>
            <Box flex={1}/>

            <Typography variant='h3' component={'h1'}>
                Juan G&oacute;mez
            </Typography>
            
            <Box flex={1}/>

            <Flags />
        </Toolbar>
    </AppBar>
  )
}
