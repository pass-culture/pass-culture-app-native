import { onlineManager, useQuery } from 'react-query'

import { getRemoteBanner } from 'libs/firebase/firestore/getRemoteBanner/getRemoteBanner'
import { RemoteStoreBanner } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

export const useRemoteBanner = () => {
  const { data } = useQuery(QueryKeys.REMOTE_BANNER, getRemoteBanner, {
    staleTime: 1000 * 30,
    cacheTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
  })
  return {
    title: data?.[RemoteStoreBanner.TITLE],
    subtitle: data?.[RemoteStoreBanner.SUBTITLE],
    redirectionUrl: data?.[RemoteStoreBanner.REDIRECTION_URL],
    redirectionType: data?.[RemoteStoreBanner.REDIRECTION_TYPE],
  }
}
