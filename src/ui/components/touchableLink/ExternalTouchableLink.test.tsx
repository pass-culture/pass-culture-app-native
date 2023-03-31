import React from 'react'
import { Text } from 'react-native'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { WEBAPP_V2_URL } from 'libs/environment'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { render, fireEvent, screen, waitFor } from 'tests/utils'
import { SocialNetworkIconsMap } from 'ui/components/socials/types'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('features/navigation/navigationRef')

const navigateToItineraryMock = jest.fn()
const useItinerary = () => ({
  navigateTo: navigateToItineraryMock,
})
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary,
}))

const linkText = 'linkText'

const ExternalTouchableLinkContent = () => <Text>{linkText}</Text>

const socialNetwork = 'facebook'
const externalNav = {
  url: SocialNetworkIconsMap[socialNetwork].link,
  params: { fallbackUrl: SocialNetworkIconsMap[socialNetwork].fallbackLink },
}

describe('<ExternalTouchableLink />', () => {
  describe('External Navigation', () => {
    it('should open url with expected parameters (nominal case)', async () => {
      render(
        <ExternalTouchableLink externalNav={externalNav}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

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

      fireEvent.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(navigateToItineraryMock).toHaveBeenCalledWith(mockedFullAddress)
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

      fireEvent.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(WEBAPP_V2_URL, undefined, true)
      })
    })
  })
})
