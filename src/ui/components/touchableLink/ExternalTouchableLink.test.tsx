import React from 'react'
import { Text } from 'react-native'
import waitForExpect from 'wait-for-expect'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { render, fireEvent } from 'tests/utils'
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
describe('<ExternalTouchableLink />', () => {
  describe('External Navigation', () => {
    const socialNetwork = 'facebook'
    const externalNav = {
      url: SocialNetworkIconsMap[socialNetwork].link,
      params: { fallbackUrl: SocialNetworkIconsMap[socialNetwork].fallbackLink },
    }

    it('should open url with expected parameters (nominal case)', async () => {
      const { getByText } = render(
        <ExternalTouchableLink externalNav={externalNav}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(openUrl).toHaveBeenCalledWith(externalNav.url, externalNav.params)
      })
    })

    it('should open itinerary if address is provided', async () => {
      const { getByText } = render(
        <ExternalTouchableLink
          externalNav={{
            url: getGoogleMapsItineraryUrl(mockedFullAddress),
            address: mockedFullAddress,
          }}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigateToItineraryMock).toHaveBeenCalledWith(mockedFullAddress)
      })
    })
  })
})
