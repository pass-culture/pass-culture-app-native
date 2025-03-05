import React from 'react'

import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<RemoteBanner/>', () => {
  it('should show web specific subtitle', async () => {
    setFeatureFlags([
      {
        featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER,
        options: bannerExternalUrl,
      },
    ])
    render(<RemoteGenericBanner from="Profile" />)

    const subtitle = screen.queryByText('subtitleWeb')

    expect(subtitle).toBeInTheDocument()
  })

  it('should not show mobile specific subtitle', async () => {
    setFeatureFlags([
      {
        featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER,
        options: bannerExternalUrl,
      },
    ])
    render(<RemoteGenericBanner from="Profile" />)

    const subtitle = screen.queryByText('subtitleMobile')

    expect(subtitle).not.toBeInTheDocument()
  })

  it('should have noRightIcon for store redirection on web', async () => {
    setFeatureFlags([
      {
        featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER,
        options: bannerStoreRedirection,
      },
    ])
    render(<RemoteGenericBanner from="Profile" />)

    const rightIcon = screen.queryByTestId('ArrowNext')

    expect(rightIcon).not.toBeInTheDocument()
  })

  it('should have correct accessibilityRole for store redirection', async () => {
    setFeatureFlags([
      {
        featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER,
        options: bannerStoreRedirection,
      },
    ])
    render(<RemoteGenericBanner from="Profile" />)

    const buttonBanner = await screen.findByRole(AccessibilityRole.BUTTON)

    expect(buttonBanner).toBeTruthy()
  })

  it('should have correct accessibilityRole for external redirection', async () => {
    setFeatureFlags([
      {
        featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER,
        options: bannerExternalUrl,
      },
    ])
    render(<RemoteGenericBanner from="Profile" />)

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
