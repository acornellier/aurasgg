import React, { createContext, useContext, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeDispatchContext = createContext<
  [Aura.SearchAura | undefined, (aura: Aura.SearchAura | undefined) => void]
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>([undefined, () => {}])

const SelectedAuraProvider = ({ children }: ThemeProviderProps) => {
  const [selectedAura, setSelectedAura] = useState<Aura.SearchAura>()

  return (
    <ThemeDispatchContext.Provider value={[selectedAura, setSelectedAura]}>
      {children}
    </ThemeDispatchContext.Provider>
  )
}

export default SelectedAuraProvider

export const useSelectedAura = () => useContext(ThemeDispatchContext)
