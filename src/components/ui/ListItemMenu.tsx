import { FC } from 'react'
import NextLink from 'next/link'
import { Box, Link, ListItem } from '@mui/material'
import { useRouter } from 'next/router'

interface IListItemMenu {
    url: string,
    label: string,
    title: string
}

export const ListItemMenu: FC<IListItemMenu> = ({url, label, title}) => {    
  const { locale } = useRouter();
  
  return (
    <ListItem>
        <Box flex={1}/>
            <NextLink href={ `${url}` } legacyBehavior locale={ locale } hrefLang={ locale }>
                <Link underline='hover' style={{ cursor: 'pointer' }} title={ title }>
                    { label }
                </Link>
            </NextLink>
        <Box flex={1}/>
    </ListItem>
  )
}