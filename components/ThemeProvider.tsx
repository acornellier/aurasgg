import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles'
import { useCookies } from 'react-cookie'
import { PaletteType } from '@material-ui/core'
import { Overrides } from '@material-ui/core/styles/overrides'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeDispatchContext = createContext<(() => void) | undefined>(undefined)
const themeCookie = 'theme'

const themeOverrides: Overrides = {
  MuiDialog: {
    container: {
      alignItems: 'baseline',
    },
  },
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [cookies, setCookie] = useCookies([themeCookie])

  const [palette, setPalette] = useState<PaletteType>(
    cookies[themeCookie] || 'light',
  )

  const toggleTheme = useCallback(() => {
    const newPalette = palette === 'light' ? 'dark' : 'light'
    console.log(newPalette)
    setCookie(themeCookie, newPalette, { sameSite: 'lax' })
    setPalette(newPalette)
  }, [palette, setPalette, setCookie])

  const theme = useMemo(() => {
    return createMuiTheme({
      palette: { type: palette },
      overrides: themeOverrides,
    })
  }, [palette])

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeDispatchContext.Provider value={toggleTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider

export const useToggleTheme = () => useContext(ThemeDispatchContext)
