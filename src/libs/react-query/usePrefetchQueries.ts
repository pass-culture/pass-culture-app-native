import { useEffect } from 'react'

import { eventMonitoring } from 'libs/monitoring/services'
import { prefetchSettingsQuery } from 'queries/settings/settingsQuery'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

const prefetchQueries = async () => {
  try {
    await prefetchSettingsQuery()
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    eventMonitoring.captureException(`Error when prefetching queries: ${errorMessage}`, {
      extra: { error },
    })
    // do nothing else in case queries prefetching fails
  }
}

export const usePrefetchQueries = () => {
  useEffect(() => {
    prefetchQueries()
  }, [])
}
