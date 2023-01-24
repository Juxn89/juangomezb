import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Box, Grid, Typography } from '@mui/material';
import { DownloadCV } from '@components/ui';
import { useTranslationsLabels } from '@hooks/index';
import { LanguageType } from '@common/types';

export const AboutContent: FC = () => {
  const { locale } = useRouter()
  const { about } = useTranslationsLabels(locale as LanguageType)

  return (
    <Box>
      <Grid container spacing={1} style={{ height: '60vh' }}>
        <Grid item xs={12} sm={8} sx={{ border: 'solid 1px red' }}>
          <Typography variant='h4'> { about.initialGetting } </Typography>
          <Typography variant='h6'> { about.subTitle } </Typography>
          <Typography paragraph sx={{ mt: 5 }}>
            { about.description }
          </Typography>
        </Grid>
        <Grid 
          item 
          xs={12} 
          sm={4} 
          sx={{ border: 'solid 1px green' }}
          display='flex'
          alignItems='center'
          alignContent='center'
          direction='column'
        >
          <Image 
            alt="Juan Gómez's profile picture" 
            src='/assets/img/jgomez_profile_picture_00.jfif' 
            width="200" 
            height="200"
          />          
          <DownloadCV />
        </Grid>
      </Grid>
    </Box>
  )
}
