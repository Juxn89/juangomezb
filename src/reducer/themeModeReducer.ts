import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store/store';

interface ThemeModeState {
	isDarkMode: boolean
}

const initialState: ThemeModeState = {
	isDarkMode: false
}

export const themeModeSlice = createSlice({
	name: 'ThemeMode',
	initialState,
	reducers: {
		changeThemeMode: (state) => {
			state.isDarkMode = !state.isDarkMode
		}
	}
})

export const { changeThemeMode } = themeModeSlice.actions;
export const selectThemeMode = (state: RootState) => state.themeMode
export default themeModeSlice.reducer;