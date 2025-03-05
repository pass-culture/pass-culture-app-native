import React from 'react'

import { RemoteBannerOrigin } from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Info } from 'ui/svg/icons/Info'

import { RemoteBanner } from '../components/RemoteBanner'

export const RemoteGenericBanner = ({ from }: { from: RemoteBannerOrigin }) => {
  const { options } = useFeatureFlagOptions(RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER)

  return (
    <RemoteBanner
      from={from}
      options={options}
      leftIcon={Info}
      logClickEvent={analytics.logHasClickedRemoteGenericBanner}
      analyticsParams={{ from: 'home', type: 'remoteGenericBanner' }}
    />
  )
}
