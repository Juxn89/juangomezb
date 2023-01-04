import { FC } from 'react'
import NextLink from 'next/link'
import { Box, Link, ListItem } from '@mui/material'

interface IListItemMenu {
    url: string,
    label: string
}

export const ListItemMenu: FC<IListItemMenu> = ({url, label}) => {
  return (
    <ListItem>
        <Box flex={1}/>
            <NextLink href={ `${url}` } legacyBehavior>
                <Link underline='hover' style={{ cursor: 'pointer' }} title="">
                    { label }
                </Link>
            </NextLink>
        <Box flex={1}/>
    </ListItem>
  )
}