import { FC } from 'react';
import { Grid } from '@mui/material';
import { Menu } from '@components/index';

interface IMainLayoutProps {
  children: JSX.Element | JSX.Element[]
}

const MainLayout: FC<IMainLayoutProps> = ({children}) => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Menu />
      </Grid>
      <Grid item xs={10}>
        { children }
      </Grid>
    </Grid>
  )
}

export default MainLayout