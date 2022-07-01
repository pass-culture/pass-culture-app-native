import React from 'react'
import { Text } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate, push } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef, pushFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { analytics } from 'libs/firebase/analytics'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { render, fireEvent } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SocialNetworkIconsMap } from 'ui/components/socials/types'

import { TouchableLink } from '../TouchableLink'

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
const TouchableLinkContent = () => <Text>{linkText}</Text>
describe('<TouchableLink />', () => {
  describe('Internal Navigation', () => {
    it('should navigate to right screen with expected params (nominal case)', async () => {
      const { getByText } = render(
        <TouchableLink navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1] }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigate).toBeCalledWith(...homeNavConfig)
      })
    })

    it('should push right screen with expected params if withPush={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1], withPush: true }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(push).toBeCalledWith(...homeNavConfig)
      })
    })

    it('should navigate using navigateFromRef if fromRef={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1], fromRef: true }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigateFromRef).toBeCalledWith(...homeNavConfig)
      })
    })

    it('should push using pushFromRef if withPush={true} and fromRef={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{
            screen: homeNavConfig[0],
            params: homeNavConfig[1],
            fromRef: true,
            withPush: true,
          }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(pushFromRef).toBeCalledWith(...homeNavConfig)
      })
    })

    it('should fire onPress if given, before navigation', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: 'FirstTutorial' }}
          onPress={() => analytics.logConsultTutorial('profile')}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      expect(analytics.logConsultTutorial).toBeCalledWith('profile')
      expect(navigate).not.toBeCalled()
      await waitForExpect(() => {
        expect(navigate).toBeCalledWith('FirstTutorial', undefined)
      })
    })

    it('should fire onPress after navigation if navigateBeforeOnPress={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: 'FirstTutorial' }}
          onPress={() => analytics.logConsultTutorial('profile')}
          navigateBeforeOnPress>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      expect(navigate).toBeCalledWith('FirstTutorial', undefined)
      await waitForExpect(() => {
        expect(analytics.logConsultTutorial).toBeCalledWith('profile')
      })
    })

    it('should render with correct style if component tag is given', () => {
      const buttonText = 'button'
      const { getByText: getButtonByText } = render(<ButtonPrimary wording={buttonText} />)
      const { getByText } = render(
        <TouchableLink
          as={ButtonPrimary}
          wording={buttonText}
          navigateTo={{ screen: 'FirstTutorial' }}
          onPress={() => analytics.logConsultTutorial('profile')}
        />
      )
      const expectedStyle = getButtonByText(buttonText).props.style
      const link = getByText(buttonText)

      expect(getByText(buttonText)).toBeTruthy()
      expect(link.props.style).toEqual(expectedStyle)
    })
  })

  describe('External Navigation', () => {
    const socialNetwork = 'facebook'
    const externalNav = {
      url: SocialNetworkIconsMap[socialNetwork].link,
      params: { fallbackUrl: SocialNetworkIconsMap[socialNetwork].fallbackLink },
    }

    it('should open url with expected parameters if external link is given (nominal case)', async () => {
      const { getByText } = render(
        <TouchableLink externalNav={externalNav}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(openUrl).toBeCalledWith(externalNav.url, externalNav.params)
      })
    })

    it('should fire onPress if given, before navigation', async () => {
      const { getByText } = render(
        <TouchableLink
          externalNav={externalNav}
          onPress={() => analytics.logClickSocialNetwork(socialNetwork)}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      expect(analytics.logClickSocialNetwork).toBeCalledWith(socialNetwork)
      expect(openUrl).not.toBeCalled()
      await waitForExpect(() => {
        expect(openUrl).toBeCalledWith(externalNav.url, externalNav.params)
      })
    })

    it('should fire onPress after navigation if navigateBeforeOnPress={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          externalNav={externalNav}
          onPress={() => analytics.logClickSocialNetwork(socialNetwork)}
          navigateBeforeOnPress>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      expect(openUrl).toBeCalledWith(externalNav.url, externalNav.params)
      expect(analytics.logConsultAccessibility).not.toBeCalled()
      await waitForExpect(() => {
        expect(analytics.logClickSocialNetwork).toBeCalledWith(socialNetwork)
      })
    })

    it('should open itinerary if address is provided', async () => {
      const { getByText } = render(
        <TouchableLink
          externalNav={{
            url: getGoogleMapsItineraryUrl(mockedFullAddress),
            address: mockedFullAddress,
          }}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigateToItineraryMock).toBeCalledWith(mockedFullAddress)
      })
    })

    it('should render with correct style if component tag is given', () => {
      const buttonText = 'button'
      const { getByText: getButtonByText } = render(<ButtonPrimary wording={buttonText} />)
      const { getByText } = render(
        <TouchableLink
          as={ButtonPrimary}
          wording={buttonText}
          externalNav={externalNav}
          onPress={() => analytics.logClickSocialNetwork(socialNetwork)}
        />
      )
      const expectedStyle = getButtonByText(buttonText).props.style
      const link = getByText(buttonText)

      expect(getByText(buttonText)).toBeTruthy()
      expect(link.props.style).toEqual(expectedStyle)
    })
  })
})
