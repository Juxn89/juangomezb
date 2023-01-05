import { FC, useState } from 'react'
import { Box, Typography } from '@mui/material'

export const SwitchTheme: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const ChangeModeTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
	<Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
    {
      isDarkMode 
        ? <Typography sx={{ fontSize: 29, cursor: 'pointer' }} title='Light version' onClick={ ChangeModeTheme }>☀️</Typography> 
        : <Typography sx={{ fontSize: 29, cursor: 'pointer' }} title='Dark version' onClick={ ChangeModeTheme }>🌘</Typography>
    }
  </Box>
  )
}