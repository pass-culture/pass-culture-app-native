import { onlineManager, useQuery } from 'react-query'

import { getBanner } from 'libs/firebase/firestore/getBanner/getBanner'
import { RemoteStoreBanner } from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

export const useBanner = () => {
  const { data } = useQuery(QueryKeys.BANNER, getBanner, {
    staleTime: 1000 * 30,
    cacheTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
  })
  return {
    title: data?.[RemoteStoreBanner.TITLE],
    subtitle: data?.[RemoteStoreBanner.SUBTITLE],
    redirectionUrl: data?.[RemoteStoreBanner.REDIRECTION_URL],
  }
}
