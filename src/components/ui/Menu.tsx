import NextLink from 'next/link'
import { Box, Link, List, ListItem } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import {ListItemMenu} from '@components/ui/index';
import { SOCIAL_NETWORKS } from '@helpers/index';

export const Menu = () => {
  return (
    <Box>
      <Box flex={1}/>
      <List >
        <ListItemMenu url='/' label='About'/>
        <ListItemMenu url='/' label='Experience'/>
        <ListItemMenu url='/' label='My Skilss'/>
        <ListItemMenu url='/' label='Contact'/>
        <ListItem sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
            <Box flex={1}/>
            <NextLink href={ SOCIAL_NETWORKS.linkedin } passHref legacyBehavior>
                <Link target='_blank' >
                    <LinkedInIcon />
                </Link>
            </NextLink>
            <NextLink href={ SOCIAL_NETWORKS.github } passHref legacyBehavior>
                <Link target='_blank'>
                    <GitHubIcon />
                </Link>
            </NextLink>
            <NextLink href={ SOCIAL_NETWORKS.twitter } passHref legacyBehavior>
                <Link target='_blank'>
                    <TwitterIcon />
                </Link>
            </NextLink>
            <Box flex={1}/>
        </ListItem>
      </List>
      <Box flex={1}/>
    </Box>
  )
}
