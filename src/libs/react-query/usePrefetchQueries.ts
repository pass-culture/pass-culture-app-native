import { useEffect } from 'react'

import { prefetchSettingsQuery } from 'queries/settings/settingsQuery'

const prefetchQueries = async () => {
  try {
    await prefetchSettingsQuery()
  } catch (err) {
    // do nothing in case the pretching of queries fails
  }
}

export const usePrefetchQueries = () => {
  useEffect(() => {
    prefetchQueries()
  }, [])
}
