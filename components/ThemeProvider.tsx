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

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeDispatchContext = createContext<(() => void) | undefined>(undefined)
const themeCookie = 'theme'

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [cookies, setCookie] = useCookies([themeCookie])

  const [palette, setPalette] = useState<PaletteType>(
    cookies[themeCookie] || 'light',
  )

  const toggleTheme = useCallback(() => {
    const newTheme = palette === 'light' ? 'dark' : 'light'
    setCookie(themeCookie, newTheme, { sameSite: 'none' })
    setPalette(newTheme)
  }, [palette, setPalette, setCookie])

  const theme = useMemo(() => {
    return createMuiTheme({ palette: { type: palette } })
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
