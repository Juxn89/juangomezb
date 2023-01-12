import { FC } from 'react';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { Box, Link, List, ListItem } from '@mui/material';
import {ListItemMenu} from '@components/ui/index';
import { useTranslationsLabels } from '@hooks/index';
import { LanguageType } from '@common/index';

export const Menu: FC = () => {
  const { locale, defaultLocale } = useRouter()
  const { menu, socialNetworks } = useTranslationsLabels(locale as LanguageType);

  return (
    <Box>
      <Box flex={1}/>
      <List >
        {
          menu.map(opt => (
            <ListItemMenu key={ opt.label } url={ opt.url } label={ opt.label } title={ opt.title } />
          ))
        }
        <ListItem sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
            <Box flex={1}/>
            {
              socialNetworks.map(item => (
                <NextLink key={ item.label } href={ '' } passHref legacyBehavior>
                    <Link target='_blank' >
                        { <item.icon /> }
                    </Link>
                </NextLink>                
              ))
            }
            <Box flex={1}/>
        </ListItem>
      </List>
      <Box flex={1}/>
    </Box>
  )
}
