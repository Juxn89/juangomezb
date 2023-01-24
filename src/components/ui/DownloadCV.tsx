import React from 'react'
import { useRouter } from 'next/router';
import { Link, Typography } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useTranslationsLabels } from '@hooks/index';
import { LanguageType } from '@common/index';

export const DownloadCV = () => {
  const { locale } = useRouter()
  const { cvFile } = useTranslationsLabels(locale as LanguageType)

  return (
    <>
      <Typography 
        display='flex' 
        textAlign='center' 
        alignContent='center' 
        alignItems='center'
        sx={{ mt: 2 }}
      >
        <Link href={ `${cvFile.url}` } title={ cvFile.title } target='_blank'>
          <PictureAsPdfOutlinedIcon /> { cvFile.label }
        </Link>
      </Typography>
    </>
  )
}
