import React, { createContext, FC, PropsWithChildren, useContext } from 'react'

import { GetHomeData } from 'features/home/api/useHomepageData'

type Dependencies = {
  getHomeData: GetHomeData
}

const DependenciesContext = createContext<Dependencies | undefined>(undefined)

export const DependenciesProvider: FC<PropsWithChildren<Dependencies>> = ({
  children,
  ...props
}) => {
  return <DependenciesContext.Provider value={props}>{children}</DependenciesContext.Provider>
}

export const useDependencies = () => {
  const context = useContext(DependenciesContext)
  if (!context) {
    throw new Error('useDependencies must be used within a DependenciesProvider')
  }
  return context
}
