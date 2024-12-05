import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react'

interface OfferCTAContextValue {
  wording: string
  onPress: () => void
  setButton: (wording: string, onPress: () => void) => void
  showButton: (isVisible: boolean) => void
  isButtonVisible: boolean
}

const OfferCTAContext = createContext<OfferCTAContextValue | undefined>(undefined)

interface OfferCTAProviderProps {
  children: ReactNode
}

export const OfferCTAProvider: React.FC<OfferCTAProviderProps> = ({ children }) => {
  const [wording, setWording] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [onPress, setOnPress] = useState<() => void>(() => () => {
    return
  })

  const setButton = useCallback(
    (newWording: string, newOnPress: () => void) => {
      if (newWording !== wording) {
        setWording(newWording)
        setOnPress(() => newOnPress)
      }
    },
    [wording]
  )

  const value = useMemo(
    () => ({
      wording,
      onPress,
      setButton,
      showButton: setIsVisible,
      isButtonVisible: isVisible && !!wording.length,
    }),
    [isVisible, onPress, setButton, wording]
  )

  return <OfferCTAContext.Provider value={value}>{children}</OfferCTAContext.Provider>
}

export const useOfferCTA = (): OfferCTAContextValue => {
  const context = useContext(OfferCTAContext)
  if (!context) {
    throw new Error('useOfferCTAButton must be used within an OfferCTAProvider')
  }
  return context
}
