// Whilst app search is not activated, we still launch the request to populate
// App search's cache for future faster requests. Thus we build up the cache
// with actual requests.
// We also use a load controller fron firestore

import { useSearchLoad } from 'libs/firestore/searchLoad'
import { MonitoringMessage } from 'libs/monitoring'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'

// TODO(antoinewg): delete once the migration to AppSearch is completed
export const useSendAdditionalRequestToAppSearch = () => {
  const { isAppSearchBackend } = useAppSearchBackend()
  const searchLoad = useSearchLoad()

  return (request: () => Promise<unknown>) => () => {
    try {
      if (!isAppSearchBackend && isBelowSearchLoad(searchLoad)) {
        request()
      }
    } catch (err) {
      new MonitoringMessage('duplicate_app_search_request_fail' + err)
    }
  }
}

/**
 * @param searchLoad number between 0 and 100, configured in firestore
 */
const isBelowSearchLoad = (searchLoad: number): boolean => {
  const randomLoad = Math.random() * 100
  return randomLoad < searchLoad
}
