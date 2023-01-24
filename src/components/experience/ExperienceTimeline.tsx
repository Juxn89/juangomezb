import { FC } from 'react'
import { useRouter } from 'next/router';
import { Chip, Stack } from '@mui/material';
import Timeline from '@mui/lab/Timeline'
import { TimelineItem, timelineItemClasses } from '@mui/lab';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import Typography from '@mui/material/Typography';
import { useTranslationsLabels } from '@hooks/index';
import { LanguageType } from '@common/index';

export const ExperienceTimeline: FC = () => {
  const { locale } = useRouter()
  const { workExperience, common } = useTranslationsLabels(locale as LanguageType)
  return (
    <Timeline
        sx={{
            [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
            }
        }}
    >
        {
            workExperience.map(experience => (
                <TimelineItem key={ experience.place }>
                    <TimelineSeparator>
                        <TimelineDot color={ experience.isCurrentJob ? 'success' : 'info' }/>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography sx={{ fontWeight: 'blod' }}>{ experience.place }</Typography>
                        <Typography>
                            { experience.dateStart } - { experience.isCurrentJob ? common.current : experience.dateEnd }
                        </Typography>
                        <Typography>
                            <Stack direction='row' spacing={1}>
                                { experience.technologies.map(tech => (
                                    <Chip 
                                        key={ `${experience.place}_${tech}` } 
                                        label={ tech } 
                                        variant='outlined' 
                                        component='span'
                                        color='info'
                                        size='small'
                                    />
                                )) 
                                }                                
                            </Stack>
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            ))
        }
    </Timeline>
  )
}
