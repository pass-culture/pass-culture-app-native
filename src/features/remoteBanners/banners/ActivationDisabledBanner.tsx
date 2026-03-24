import React from 'react'
import { View } from 'react-native'

import { RemoteBannerOrigin } from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { Hourglass } from 'ui/svg/icons/Hourglass'

import { RemoteBanner } from '../components/RemoteBanner'

type DisableActivationBannerProps = {
  from?: RemoteBannerOrigin
  remoteActivationBannerOptions?: Record<string, unknown>
}

export const ActivationDisabledBanner = ({
  from = 'profile',
  remoteActivationBannerOptions,
}: DisableActivationBannerProps) => {
  if (!remoteActivationBannerOptions) return null
  return (
    <View testID="activation-disabled-banner">
      <RemoteBanner
        from={from}
        options={remoteActivationBannerOptions}
        logClickEvent={analytics.logHasClickedRemoteActivationBanner}
        analyticsParams={{ from, type: 'remoteActivationBanner' }}
        leftIcon={Hourglass}
      />
    </View>
  )
}
