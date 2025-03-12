import React from 'react'

import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType as RemoteBannerType,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<RemoteActivationBanner/>', () => {
  it('should log analytics when user presses banner', async () => {
    render(
      <RemoteActivationBanner from="profile" remoteActivationBannerOptions={bannerExternalUrl} />
    )

    const banner = await screen.findByText('title 1')
    await user.press(banner)

    expect(analytics.logHasClickedRemoteActivationBanner).toHaveBeenCalledWith('profile', {
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
