import React from 'react'

import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { render, screen } from 'tests/utils/web'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')
jest.mock('libs/firebase/analytics/analytics')

describe('<RemoteBanner/>', () => {
  it('should show web specific subtitle', async () => {
    render(<RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerExternalUrl} />)

    const subtitle = screen.queryByText('subtitleWeb')

    expect(subtitle).toBeInTheDocument()
  })

  it('should not show mobile specific subtitle', async () => {
    render(<RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerExternalUrl} />)

    const subtitle = screen.queryByText('subtitleMobile')

    expect(subtitle).not.toBeInTheDocument()
  })

  it('should have noRightIcon for store redirection on web', async () => {
    render(
      <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerStoreRedirection} />
    )

    const rightIcon = screen.queryByTestId('ArrowNext')

    expect(rightIcon).not.toBeInTheDocument()
  })

  it('should have correct accessibilityRole for store redirection', async () => {
    render(
      <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerStoreRedirection} />
    )

    const buttonBanner = await screen.findByRole(AccessibilityRole.BUTTON)

    expect(buttonBanner).toBeTruthy()
  })

  it('should have correct accessibilityRole for external redirection', async () => {
    render(<RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerExternalUrl} />)

    const linkBanner = await screen.findByRole(AccessibilityRole.LINK)

    expect(linkBanner).toBeTruthy()
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
