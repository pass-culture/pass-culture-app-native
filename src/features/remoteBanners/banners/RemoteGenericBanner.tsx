import React from 'react'

import { RemoteBannerOrigin } from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { Info } from 'ui/svg/icons/Info'

import { RemoteBanner } from '../components/RemoteBanner'

type RemoteGenericBannerProps = {
  from: RemoteBannerOrigin
  remoteGenericBannerOptions: Record<string, unknown>
}

export const RemoteGenericBanner = ({
  from,
  remoteGenericBannerOptions,
}: RemoteGenericBannerProps) => {
  return (
    <RemoteBanner
      from={from}
      options={remoteGenericBannerOptions}
      leftIcon={Info}
      logClickEvent={analytics.logHasClickedRemoteGenericBanner}
      analyticsParams={{ from: 'home', type: 'remoteGenericBanner' }}
    />
  )
}
