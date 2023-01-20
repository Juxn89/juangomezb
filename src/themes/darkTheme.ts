import { createTheme } from "@mui/material";
import { grey } from '@mui/material/colors'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
	components: {
		MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'fixed',
      },
      styleOverrides: {
        root: {
          backgroundColor: grey[900],
          height: 60
        },
      }
    },
		MuiTypography: {
			styleOverrides: {
				root: {
					color: "white"
				}
			}
		}
	}
});