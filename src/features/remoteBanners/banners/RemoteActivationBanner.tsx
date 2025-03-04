import React from 'react'

import { RemoteBannerOrigin } from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { RemoteBanner } from '../components/RemoteBanner'

export const RemoteActivationBanner = ({ from }: { from: RemoteBannerOrigin }) => {
  const { options } = useFeatureFlagOptions(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)

  return (
    <RemoteBanner
      from={from}
      options={options}
      logClickEvent={analytics.logHasClickedRemoteActivationBanner}
    />
  )
}
