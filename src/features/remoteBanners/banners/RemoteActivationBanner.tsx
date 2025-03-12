import React from 'react'

import { RemoteBannerOrigin } from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { Hourglass } from 'ui/svg/icons/Hourglass'

import { RemoteBanner } from '../components/RemoteBanner'

type RemoteActivationBannerProps = {
  from: RemoteBannerOrigin
  remoteActivationBannerOptions: Record<string, unknown>
}

export const RemoteActivationBanner = ({
  from,
  remoteActivationBannerOptions,
}: RemoteActivationBannerProps) => {
  return (
    <RemoteBanner
      from={from}
      options={remoteActivationBannerOptions}
      logClickEvent={analytics.logHasClickedRemoteActivationBanner}
      analyticsParams={{ from, type: 'remoteActivationBanner' }}
      leftIcon={Hourglass}
    />
  )
}
