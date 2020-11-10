import React from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'

export const reactQueryProviderHOC = (
  component: React.ReactNode,
  defaultQueryCache?: QueryCache
) => {
  const queryCache = defaultQueryCache ?? new QueryCache()
  return <ReactQueryCacheProvider queryCache={queryCache}>{component}</ReactQueryCacheProvider>
}
