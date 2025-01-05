import React, { Context, ReactNode, createContext, useContext, useEffect } from 'react'
import { useSnapshot } from 'valtio'

import { createCore } from 'libs/poc-valtio/core'

const AppStateContext = createContext<Record<string, unknown> | null>(null)

interface ProviderProps {
  children: ReactNode
  coreInstance: Record<string, unknown>
}

export const CoreProvider: React.FC<ProviderProps> = ({ children, coreInstance }) => (
  <AppStateContext.Provider value={coreInstance}>{children}</AppStateContext.Provider>
)

export function useAppContext<T>(): T {
  const context = useContext<T | null>(AppStateContext as Context<T | null>)
  if (!context) {
    throw new Error('useAppContext must be used within a CortexProvider')
  }
  return context
}

function generateTypedHooks<
  T extends Record<string, { state: object; actions: Record<string, VoidFunction> }>,
>() {
  const useStore = <U extends keyof T>(service: U): T[U]['state'] => {
    const instance = useAppContext<T>()
    const serviceInstance = instance[service]
    if (!serviceInstance) {
      throw new Error(`Service ${String(service)} not found`)
    }
    return useSnapshot(serviceInstance.state)
  }

  const useAction = <U extends keyof T>(service: U): T[U]['actions'] => {
    const instance = useAppContext<T>()
    const serviceInstance = instance[service]
    if (!serviceInstance) {
      throw new Error(`Service ${String(service)} not found`)
    }
    return serviceInstance.actions
  }

  return { useStore, useAction }
}

const { useStore, useAction } = generateTypedHooks<ReturnType<typeof createCore>>()

export const useActivationDate = () => {
  const creditStore = useStore('credit')
  const { incrementCredits } = useAction('credit')

  useEffect(() => {
    incrementCredits()
  }, [incrementCredits])

  return creditStore.activationDate
}
