import React, { useContext, useMemo, useState } from 'react'

interface SearchAnalyticsContextType {
  currentQueryID?: string
  setCurrentQueryID: (queryID?: string) => void
}

const defaultContext = {
  currentQueryID: undefined,
  setCurrentQueryID: () => {
    return
  },
}
const SearchAnalyticsContext = React.createContext<SearchAnalyticsContextType>(defaultContext)

export const SearchAnalyticsWrapper = ({ children }: { children: JSX.Element }) => {
  const [currentQueryID, setCurrentQueryID] = useState<string | undefined>()

  const value = useMemo(
    () => ({
      currentQueryID,
      setCurrentQueryID,
    }),
    [currentQueryID]
  )
  return <SearchAnalyticsContext.Provider value={value}>{children}</SearchAnalyticsContext.Provider>
}

export const useSearchAnalyticsState = (): SearchAnalyticsContextType => {
  return useContext(SearchAnalyticsContext)
}
