import { NextPage } from 'next'
import { MainLayout } from '@components/layouts'
import { Typography } from '@mui/material'

const InternalServerErrorPage: NextPage = () => {
  return (
    <MainLayout>
      <Typography variant='h3' component='h1'>500</Typography>
      <Typography variant='h5' component='h2'>Server-side error occurred</Typography>
    </MainLayout>
  )
}

export default InternalServerErrorPage