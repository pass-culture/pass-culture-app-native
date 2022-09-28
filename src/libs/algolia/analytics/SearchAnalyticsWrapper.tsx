import React, { useContext, useState } from 'react'

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

  return (
    <SearchAnalyticsContext.Provider
      value={{
        currentQueryID,
        setCurrentQueryID,
      }}>
      {children}
    </SearchAnalyticsContext.Provider>
  )
}

export const useSearchAnalyticsState = (): SearchAnalyticsContextType => {
  return useContext(SearchAnalyticsContext)
}
