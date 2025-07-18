import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { DisableActivation } from 'features/identityCheck/pages/DisableActivation'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import {
  RemoteBannerRedirectionType,
  RemoteBannerType,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

const bannerExternalInformations: RemoteBannerType = {
  title: 'Title from RemoteGenericBanner',
  subtitleMobile: 'subtitleMobile',
  subtitleWeb: 'subtitleWeb',
  redirectionUrl: 'https://www.test.fr',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}

describe('<DisableActivation/>', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(<DisableActivation />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to Home when clicking on "Retourner à l’accueil" button', async () => {
    render(<DisableActivation />)

    const goHomeButton = screen.getByText('Retourner à l’accueil')
    await userEvent.press(goHomeButton)

    expect(navigate).toHaveBeenCalledWith(homeNavigationConfig[0], homeNavigationConfig[1])
  })

  it('should open FAQ link when pressing "Plus d’infos dans notre FAQ"', async () => {
    render(<DisableActivation />)

    const faqButton = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(faqButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_CREDIT_V3, undefined, true)
  })

  it('should log analytics when pressing "Plus d’infos dans notre FAQ"', async () => {
    render(<DisableActivation />)

    const faqButton = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(faqButton)

    expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledTimes(1)
  })

  describe('with RemoteActivationBanner informations', () => {
    beforeEach(() =>
      setFeatureFlags([
        {
          featureFlag: RemoteStoreFeatureFlags.DISABLE_ACTIVATION,
          options: bannerExternalInformations,
        },
      ])
    )

    it('should render correctly', () => {
      render(<DisableActivation />)

      expect(screen).toMatchSnapshot()
    })

    it('should display correct title from feature flag options', () => {
      render(<DisableActivation />)

      expect(screen.getByText(bannerExternalInformations.title)).toBeTruthy()
    })

    it('should display correct external title from feature flag options', () => {
      render(<DisableActivation />)

      // bannerExternalInformations.subtitleMobile is never undefined in test
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(screen.getByText(bannerExternalInformations.subtitleMobile!)).toBeTruthy()
    })

    it('should open FAQ link from feature flag options when pressing external link', async () => {
      render(<DisableActivation />)

      const faqButton = screen.getByText('subtitleMobile')
      await userEvent.press(faqButton)

      expect(openUrl).toHaveBeenNthCalledWith(
        1,
        bannerExternalInformations.redirectionUrl,
        undefined,
        true
      )
    })
  })
})
