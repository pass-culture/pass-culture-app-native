import React from 'react'

import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import {
  RemoteBannerRedirectionType,
  validateRemoteBanner,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/remoteBanners/utils/remoteBannerSchema')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

const mockValidate = validateRemoteBanner as jest.Mock

const bannerExternalUrl = {
  title: 'title',
  subtitleMobile: 'subtitleMobile',
  subtitleWeb: 'subtitleWeb',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}

const bannerStoreRedirection = {
  title: 'title',
  subtitleMobile: 'subtitleMobile',
  subtitleWeb: 'subtitleWeb',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.STORE,
}

describe('<RemoteGenericBanner /> (web)', () => {
  it('should show web subtitle', () => {
    mockValidate.mockReturnValueOnce(bannerExternalUrl)

    render(
      reactQueryProviderHOC(
        <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerExternalUrl} />
      )
    )

    expect(screen.getByText('subtitleWeb')).toBeInTheDocument()
  })

  it('should not show mobile subtitle', () => {
    mockValidate.mockReturnValueOnce(bannerExternalUrl)

    render(
      reactQueryProviderHOC(
        <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerExternalUrl} />
      )
    )

    expect(screen.queryByText('subtitleMobile')).not.toBeInTheDocument()
  })

  it('should not display right icon for store redirection on web', () => {
    mockValidate.mockReturnValueOnce(bannerStoreRedirection)

    render(
      reactQueryProviderHOC(
        <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerStoreRedirection} />
      )
    )

    expect(screen.queryByTestId('ArrowNext')).not.toBeInTheDocument()
  })

  it('should have button role for store redirection on web', async () => {
    mockValidate.mockReturnValueOnce(bannerStoreRedirection)

    render(
      reactQueryProviderHOC(
        <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerStoreRedirection} />
      )
    )

    const banner = await screen.findByRole(AccessibilityRole.BUTTON)

    expect(banner).toBeInTheDocument()
  })

  it('should have link role for external redirection', async () => {
    mockValidate.mockReturnValueOnce(bannerExternalUrl)

    render(
      reactQueryProviderHOC(
        <RemoteGenericBanner from="profile" remoteGenericBannerOptions={bannerExternalUrl} />
      )
    )

    const banner = await screen.findByRole(AccessibilityRole.LINK)

    expect(banner).toBeInTheDocument()
  })
})
