import { NextPage } from 'next'
import { Grid } from '@mui/material'
import { MainLayout } from '@components/layouts'
import { ExperienceTimeline } from '@components/experience/ExperienceTimeline'

const experience: NextPage = () => {
  return (
    <MainLayout>
      <ExperienceTimeline />
    </MainLayout>
  )
}

export default experience