import React from 'react'

import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType,
} from 'features/remoteBanner/components/remoteBannerSchema'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('RemoteBanner', () => {
  it('should show web specific subtitle', async () => {
    setFeatureFlags([
      { featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER, options: bannerExternalUrl },
    ])
    render(<RemoteBanner from="Profile" />)

    const subtitle = screen.queryByText('subtitleWeb')

    expect(subtitle).toBeInTheDocument()
  })

  it('should not show mobile specific subtitle', async () => {
    setFeatureFlags([
      { featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER, options: bannerExternalUrl },
    ])
    render(<RemoteBanner from="Profile" />)

    const subtitle = screen.queryByText('subtitleMobile')

    expect(subtitle).not.toBeInTheDocument()
  })

  it('should have noRightIcon for store redirection on web', async () => {
    setFeatureFlags([
      { featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER, options: bannerStoreRedirection },
    ])
    render(<RemoteBanner from="Profile" />)

    const rightIcon = screen.queryByTestId('ArrowNext')

    expect(rightIcon).not.toBeInTheDocument()
  })
})

const bannerExternalUrl: RemoteBannerType = {
  title: 'title',
  subtitleMobile: 'subtitleMobile',
  subtitleWeb: 'subtitleWeb',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}

const bannerStoreRedirection: RemoteBannerType = {
  title: 'title',
  subtitleMobile: 'subtitleMobile',
  subtitleWeb: 'subtitleWeb',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.STORE,
}
