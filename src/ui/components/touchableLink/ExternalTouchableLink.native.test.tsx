import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { render, screen, waitFor, userEvent } from 'tests/utils'
import { SocialNetworkIconsMap } from 'ui/components/socials/types'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Typo } from 'ui/theme'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('features/navigation/navigationRef')

const mockNavigateToItinerary = jest.fn()
const mockUseItinerary = () => ({
  navigateTo: mockNavigateToItinerary,
})
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => mockUseItinerary()),
}))

const linkText = 'linkText'

const ExternalTouchableLinkContent = () => <Typo.Body>{linkText}</Typo.Body>

const socialNetwork = 'facebook'
const externalNav = {
  url: SocialNetworkIconsMap[socialNetwork].link,
  params: { fallbackUrl: SocialNetworkIconsMap[socialNetwork].fallbackLink },
}

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ExternalTouchableLink />', () => {
  describe('External Navigation', () => {
    it('should open url with expected parameters (nominal case)', async () => {
      render(
        <ExternalTouchableLink externalNav={externalNav}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      user.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(externalNav.url, externalNav.params, true)
      })
    })

    it('should open itinerary if address is provided', async () => {
      render(
        <ExternalTouchableLink
          externalNav={{
            url: getGoogleMapsItineraryUrl(mockedFullAddress),
            address: mockedFullAddress,
          }}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      user.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(mockNavigateToItinerary).toHaveBeenCalledWith(mockedFullAddress)
      })
    })

    it('should open in-app urls in new window by default', async () => {
      render(
        <ExternalTouchableLink
          externalNav={{
            url: WEBAPP_V2_URL,
          }}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      user.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(WEBAPP_V2_URL, undefined, true)
      })
    })

    it('should open in-app urls in current window or app when openInNewWindow=false', async () => {
      render(
        <ExternalTouchableLink
          externalNav={{
            url: WEBAPP_V2_URL,
          }}
          openInNewWindow={false}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      user.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(navigateFromRef).toHaveBeenCalledWith(...homeNavConfig)
      })
    })
  })
})
