import React from 'react'
import { Text } from 'react-native'
import waitForExpect from 'wait-for-expect'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { WEBAPP_V2_URL } from 'libs/environment'
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
        expect(openUrl).toHaveBeenCalledWith(externalNav.url, externalNav.params, true)
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

    it('should open in-app urls in new window by default', async () => {
      const { getByText } = render(
        <ExternalTouchableLink
          externalNav={{
            url: WEBAPP_V2_URL,
          }}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(openUrl).toHaveBeenCalledWith(WEBAPP_V2_URL, undefined, true)
      })
    })

    it('should open in-app urls in current window or app when openInNewWindow=false', async () => {
      const { getByText } = render(
        <ExternalTouchableLink
          externalNav={{
            url: WEBAPP_V2_URL,
          }}
          openInNewWindow={false}>
          <ExternalTouchableLinkContent />
        </ExternalTouchableLink>
      )

      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigateFromRef).toHaveBeenCalledWith(...homeNavConfig)
      })
    })
  })
})
