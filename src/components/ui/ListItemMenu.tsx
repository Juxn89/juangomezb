import { FC } from 'react'
import NextLink from 'next/link'
import { Box, Button, Link, ListItem } from '@mui/material'
import { useRouter } from 'next/router'

interface IListItemMenu {
    url: string,
    label: string,
    title: string
}

export const ListItemMenu: FC<IListItemMenu> = ({url, label, title}) => {    
  const { locale } = useRouter();
  
  return (
    <ListItem sx={{ pr: { xs: '6px', sm: '16px' }, pl: { xs: '6px', sm: '16px' } }}>
      <Box flex={1}/>
      <NextLink href={ `${url}` } legacyBehavior locale={ locale } hrefLang={ locale }>
        <Link underline='hover' style={{ cursor: 'pointer' }} title={ title }>
          <Button sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}> { label } </Button>
        </Link>
      </NextLink>
      <Box flex={1}/>
    </ListItem>
  )
}