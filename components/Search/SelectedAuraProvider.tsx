import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/router'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeDispatchContext = createContext<
  [Aura.SearchAura | undefined, (aura: Aura.SearchAura | undefined) => void]
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>([undefined, () => {}])

const SelectedAuraProvider = ({ children }: ThemeProviderProps) => {
  const router = useRouter()
  const [selectedAura, setAura] = useState<Aura.SearchAura>()
  const [backupPath, setBackupPath] = useState<string>()

  console.log(router)

  const setSelectedAura = (aura: Aura.SearchAura | undefined) => {
    console.log('setSelectedAura', aura)
    if (aura) {
      history.pushState({}, '', `/${aura.id}`)
      setBackupPath(router.asPath)
    } else {
      history.pushState({}, '', backupPath)
      setBackupPath(undefined)
    }
    setAura(aura)
  }

  return (
    <ThemeDispatchContext.Provider value={[selectedAura, setSelectedAura]}>
      {children}
    </ThemeDispatchContext.Provider>
  )
}

export default SelectedAuraProvider

export const useSelectedAura = () => useContext(ThemeDispatchContext)
