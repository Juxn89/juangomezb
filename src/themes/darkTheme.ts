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
          backgroundColor: "white",
          height: 60
        },
      }
    },
		MuiTypography: {
			styleOverrides: {
				root: {
					color: grey[900]
				}
			}
		}
	}
});