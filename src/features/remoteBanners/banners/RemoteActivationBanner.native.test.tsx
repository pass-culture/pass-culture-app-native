import React from 'react'

import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType as RemoteBannerType,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<RemoteActivationBanner/>', () => {
  it('should log analytics when user presses banner', async () => {
    setFeatureFlags([
      {
        featureFlag: RemoteStoreFeatureFlags.DISABLE_ACTIVATION,
        options: bannerExternalUrl,
      },
    ])
    render(<RemoteActivationBanner from="Profile" />)

    const banner = await screen.findByText('title 1')
    await user.press(banner)

    expect(analytics.logHasClickedRemoteActivationBanner).toHaveBeenCalledWith('Profile', {
      ...bannerExternalUrl,
    })
  })
})

const bannerExternalUrl: RemoteBannerType = {
  title: 'title 1',
  subtitleMobile: 'subtitleMobile 1',
  subtitleWeb: 'subtitleWeb 1',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}
