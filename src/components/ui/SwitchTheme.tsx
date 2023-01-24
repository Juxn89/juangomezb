import { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@hooks/index'
import { useDispatch } from 'react-redux'
import { changeThemeMode } from '@reducer/index';
import { saveLocalStorage } from '@helpers/index';

export const SwitchTheme: FC = () => {
  const { isDarkMode } = useAppSelector(state => state.themeMode)
  const dispatch = useDispatch()

  const ChangeModeTheme = () => {
    dispatch( changeThemeMode() )
    saveLocalStorage('themeMode', (!isDarkMode).toString())
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