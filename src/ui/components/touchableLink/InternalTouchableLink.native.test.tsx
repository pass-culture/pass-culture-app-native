import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { navigateFromRef, pushFromRef } from 'features/navigation/navigationRef'
import { render, screen, userEvent } from 'tests/utils'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Typo } from 'ui/theme'

jest.mock('features/navigation/navigationRef')

const mockPush = jest.fn()
const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: mockPush,
})

const navigateToItineraryMock = jest.fn()
const useItinerary = () => ({
  navigateTo: navigateToItineraryMock,
})
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary,
}))

const linkText = 'linkText'
const InternalTouchableLinkContent = () => <Typo.Body>{linkText}</Typo.Body>

describe('<InternalTouchableLink />', () => {
  const user = userEvent.setup()

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should navigate to right screen with expected params (nominal case)', async () => {
    render(
      <InternalTouchableLink navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' } }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    await user.press(screen.getByText(linkText))

    expect(mockNavigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Home', params: undefined })
  })

  it('should push right screen with expected params if withPush={true}', async () => {
    render(
      <InternalTouchableLink
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, withPush: true }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    await user.press(screen.getByText(linkText))

    expect(mockPush).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Home',
      params: undefined,
    })
  })

  it('should push screen only once in case of press spamming', async () => {
    render(
      <InternalTouchableLink
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, withPush: true }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    await user.press(screen.getByText(linkText))
    await user.press(screen.getByText(linkText))
    await user.press(screen.getByText(linkText))

    expect(mockPush).toHaveBeenNthCalledWith(1, 'TabNavigator', {
      screen: 'Home',
      params: undefined,
    })
  })

  it('should navigate using navigateFromRef if fromRef={true}', async () => {
    render(
      <InternalTouchableLink
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Home' }, fromRef: true }}>
        <InternalTouchableLinkContent />
      </InternalTouchableLink>
    )

    await user.press(screen.getByText(linkText))

    expect(navigateFromRef).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Home',
      params: undefined,
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

    await user.press(screen.getByText(linkText))

    expect(pushFromRef).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Home',
      params: undefined,
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

    await user.press(screen.getByText(linkText))

    expect(mockNavigate).not.toHaveBeenCalledWith('TabNavigator', {
      screen: 'Home',
      params: undefined,
    })
  })
})
