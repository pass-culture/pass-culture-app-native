import React from 'react'
import { Text } from 'react-native'

import { navigate, push } from '__mocks__/@react-navigation/native'
import { openUrl } from 'features/navigation/helpers/__mocks__'
import { navigateFromRef, pushFromRef } from 'features/navigation/navigationRef'
import { linking } from 'features/navigation/RootNavigator/linking/__mocks__'
import { render, fireEvent, screen, waitFor } from 'tests/utils'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers')
jest.mock('features/navigation/RootNavigator/linking')

const navigateToItineraryMock = jest.fn()
const useItinerary = () => ({
  navigateTo: navigateToItineraryMock,
})
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary,
}))

const linkText = 'linkText'
const InternalTouchableLinkContent = () => <Text>{linkText}</Text>

describe('<InternalTouchableLink />', () => {
  it('should navigate to right screen with expected params (nominal case)', async () => {
    render(
      <InternalTouchableLink navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' } }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    fireEvent.press(screen.getByText(linkText))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Home', params: undefined })
    })
  })

  it('should push right screen with expected params if withPush={true}', async () => {
    render(
      <InternalTouchableLink
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, withPush: true }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    fireEvent.press(screen.getByText(linkText))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        screen: 'Home',
        params: undefined,
      })
    })
  })

  it('should navigate using navigateFromRef if fromRef={true}', async () => {
    render(
      <InternalTouchableLink
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, fromRef: true }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    fireEvent.press(screen.getByText(linkText))

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith('TabNavigator', {
        screen: 'Home',
        params: undefined,
      })
    })
  })

  it('should push using pushFromRef if withPush={true} and fromRef={true}', async () => {
    render(
      <InternalTouchableLink
        navigateTo={{
          screen: 'TabNavigator',
          params: { screen: 'Home' },
          fromRef: true,
          withPush: true,
        }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    fireEvent.press(screen.getByText(linkText))

    await waitFor(() => {
      expect(pushFromRef).toHaveBeenCalledWith('TabNavigator', {
        screen: 'Home',
        params: undefined,
      })
    })
  })

  it('should not navigate to right screen with expected params when enableNavigate is false', async () => {
    render(
      <InternalTouchableLink
        enableNavigate={false}
        navigateTo={{
          screen: 'TabNavigator',
          params: { screen: 'Home' },
          fromRef: true,
          withPush: true,
        }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    fireEvent.press(screen.getByText(linkText))

    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalledWith('TabNavigator', {
        screen: 'Home',
        params: undefined,
      })
    })
  })

  describe('internalUrl', () => {
    it.each(linking.prefixes)(
      'should navigate using openUrl when internalUrl is prefixed with %s',
      async (appUrlPrefix) => {
        const internalUrl = `${appUrlPrefix}my-url`
        render(
          <InternalTouchableLink
            enableNavigate
            navigateTo={{
              internalUrl,
            }}>
            <InternalTouchableLinkContent />
          </InternalTouchableLink>
        )

        fireEvent.press(screen.getByText(linkText))

        expect(openUrl).toHaveBeenNthCalledWith(1, internalUrl)
      }
    )

    it('should not navigate when internalUrl is not in-app url', async () => {
      render(
        <InternalTouchableLink
          enableNavigate={false}
          navigateTo={{
            internalUrl: 'http://my-url',
          }}>
          <InternalTouchableLinkContent />
        </InternalTouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

      expect(openUrl).not.toHaveBeenCalled()
    })

    it('should not navigate when internalUrl is defined and enableNavigate is false', async () => {
      render(
        <InternalTouchableLink
          enableNavigate={false}
          navigateTo={{ internalUrl: `${linking.prefixes[0]}my-url` }}>
          <InternalTouchableLinkContent />
        </InternalTouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

      expect(openUrl).not.toHaveBeenCalled()
    })
  })
})
