import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType,
} from 'features/remoteBanner/components/remoteBannerSchema'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.useFakeTimers()
const user = userEvent.setup()
const appStoreUrl = 'https://apps.apple.com/fr/app/pass-culture/id1557887412'

describe('RemoteBanner', () => {
  it('matches the snapshot', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER], bannerExternalUrl)
    render(<RemoteBanner />)

    expect(screen).toMatchSnapshot()
  })

  it('when redirection type is an expected value, banner should appear', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER], bannerExternalUrl)
    render(<RemoteBanner />)

    const banner = screen.queryByText('title 1')

    expect(banner).toBeOnTheScreen()
  })

  it('when redirection type is an unexpected value, banner should not appear', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER], bannerBadType)
    render(<RemoteBanner />)

    const banner = screen.queryByText('title 1')

    expect(banner).not.toBeOnTheScreen()
  })

  it('when redirection is to app store, should navigate to store and a11y label should be correct', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER], bannerAppStore)
    render(<RemoteBanner />)

    const banner = await screen.findByText('title 1')
    await user.press(banner)

    const accessibilityLabel = await screen.findByLabelText(`Nouvelle fenêtre : ${appStoreUrl}`)

    expect(accessibilityLabel).toBeTruthy()
    expect(openUrl).toHaveBeenCalledWith(appStoreUrl)
  })

  it('when redirection is external, should navigate to url and a11y label should be correct', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER], bannerExternalUrl)
    render(<RemoteBanner />)

    const banner = await screen.findByText('title 1')
    await user.press(banner)

    const accessibilityLabel = await screen.findByLabelText(
      'Nouvelle fenêtre : https://www.test.fr'
    )

    expect(accessibilityLabel).toBeTruthy()
    expect(openUrl).toHaveBeenCalledWith('https://www.test.fr')
  })

  it('when redirection is external, but url is an empty string, button should be disabled and there should not be an a11y label', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.SHOW_REMOTE_BANNER], bannerExternalUrlWithMissingUrl)
    render(<RemoteBanner />)

    const banner = await screen.findByText('title 1')
    await user.press(banner)

    const accessibilityLabel = screen.queryByLabelText('Nouvelle fenêtre : https://www.test.fr')

    expect(accessibilityLabel).toBeFalsy()
    expect(openUrl).not.toHaveBeenCalled()
  })
})

const bannerAppStore: RemoteBannerType = {
  title: 'title 1',
  subtitle: 'subtitle 1',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.STORE,
}

const bannerExternalUrl: RemoteBannerType = {
  title: 'title 1',
  subtitle: 'subtitle 1',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}

const bannerExternalUrlWithMissingUrl: Partial<RemoteBannerType> = {
  title: 'title 1',
  subtitle: 'subtitle 1',
  redirectionUrl: '',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}

const bannerBadType: Partial<RemoteBannerType> = {
  title: 'title 1',
  subtitle: 'subtitle 1',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: 'other',
}
