import React from 'react'
import { Text } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate, push } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef, pushFromRef } from 'features/navigation/navigationRef'
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
        <TouchableLink navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' } }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Home', params: undefined })
      })
    })

    it('should push right screen with expected params if withPush={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, withPush: true }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(push).toHaveBeenCalledWith('TabNavigator', {
          screen: 'Home',
          params: undefined,
        })
      })
    })

    it('should navigate using navigateFromRef if fromRef={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, fromRef: true }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigateFromRef).toHaveBeenCalledWith('TabNavigator', {
          screen: 'Home',
          params: undefined,
        })
      })
    })

    it('should push using pushFromRef if withPush={true} and fromRef={true}', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{
            screen: 'TabNavigator',
            params: { screen: 'Home' },
            fromRef: true,
            withPush: true,
          }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(pushFromRef).toHaveBeenCalledWith('TabNavigator', {
          screen: 'Home',
          params: undefined,
        })
      })
    })

    it('should not navigate to right screen with expected params when enableNavigate is false', async () => {
      const { getByText } = render(
        <TouchableLink
          enableNavigate={false}
          navigateTo={{
            screen: 'TabNavigator',
            params: { screen: 'Home' },
            fromRef: true,
            withPush: true,
          }}>
          <TouchableLinkContent />
        </TouchableLink>
      )
      fireEvent.press(getByText(linkText))
      await waitForExpect(() => {
        expect(navigate).not.toHaveBeenCalledWith('TabNavigator', {
          screen: 'Home',
          params: undefined,
        })
      })
    })

    it('should fire onBeforeNavigate if given, before navigation', async () => {
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: 'FirstTutorial' }}
          onBeforeNavigate={() => analytics.logConsultTutorial('profile')}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      expect(analytics.logConsultTutorial).toHaveBeenCalledWith('profile')
      expect(navigate).not.toHaveBeenCalled()
      await waitForExpect(() => {
        expect(navigate).toHaveBeenCalledWith('FirstTutorial', undefined)
      })
    })

    it('should fire onAfterNavigate after navigate', async () => {
      const mockedOnAfterNavigate = jest.fn()
      const { getByText } = render(
        <TouchableLink
          navigateTo={{ screen: 'FirstTutorial' }}
          onAfterNavigate={mockedOnAfterNavigate}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))

      expect(navigate).toHaveBeenCalledWith('FirstTutorial', undefined)
      await waitForExpect(() => {
        expect(mockedOnAfterNavigate).toHaveBeenCalled()
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
          onBeforeNavigate={() => analytics.logConsultTutorial('profile')}
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
        expect(openUrl).toHaveBeenCalledWith(externalNav.url, externalNav.params)
      })
    })

    it('should fire onBeforeNavigate before navigation', async () => {
      const mockedOnBeforeNavigate = jest.fn()
      const { getByText } = render(
        <TouchableLink externalNav={externalNav} onBeforeNavigate={mockedOnBeforeNavigate}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))

      expect(mockedOnBeforeNavigate).toHaveBeenCalled()
      expect(openUrl).not.toHaveBeenCalled()
      await waitForExpect(() => {
        expect(openUrl).toHaveBeenCalledWith(externalNav.url, externalNav.params)
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
        expect(navigateToItineraryMock).toHaveBeenCalledWith(mockedFullAddress)
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
          onBeforeNavigate={() => analytics.logClickSocialNetwork(socialNetwork)}
        />
      )
      const expectedStyle = getButtonByText(buttonText).props.style
      const link = getByText(buttonText)

      expect(getByText(buttonText)).toBeTruthy()
      expect(link.props.style).toEqual(expectedStyle)
    })
  })
})
