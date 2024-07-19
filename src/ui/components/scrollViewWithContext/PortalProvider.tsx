import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  ReactNode,
  FC,
  useMemo,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Portal<T> {
  id: string
  component: ReactNode
  parameters: T
}

interface PortalContextType<T> {
  addElement: (component: ReactNode, parameters?: T) => () => void
  elements: Portal<T>[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PortalContext = createContext<PortalContextType<any> | undefined>(undefined)

export const PortalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Portal<unknown>[]>([])

  const addElement = useCallback(function <T>(component: ReactNode, parameters: T) {
    const id = uuidv4()
    setElements((prevElements) => [...prevElements, { id, component, parameters }])

    return () => {
      setElements((prevElements) => prevElements.filter((element) => element.id !== id))
    }
  }, [])

  const value: PortalContextType<unknown> = useMemo(
    () => ({
      addElement,
      elements,
    }),
    [addElement, elements]
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal<T>(): PortalContextType<T> {
  const context = useContext<PortalContextType<T> | undefined>(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}
