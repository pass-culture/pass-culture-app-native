import React from 'react'
import { Animated, Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { Activity, VenueResponse } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import * as venueSurveyAccessStorageModule from 'features/venue/helpers/venueSurveyAccessStorage'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('features/venue/queries/useVenueQuery')
jest.useFakeTimers()

jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

const mockCheckVenueSurveyAccess = jest.spyOn(
  venueSurveyAccessStorageModule,
  'checkVenueSurveyAccess'
)

const user = userEvent.setup()
jest.useFakeTimers()

const venueWithSurveyActivity: VenueResponse = {
  ...venueDataTest,
  activity: Activity.BOOKSTORE,
}

describe('<VenueHeader />', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  it('should render all icons', () => {
    renderVenueHeader()

    expect(screen.getByLabelText('Revenir en arrière')).toBeOnTheScreen()
    expect(screen.getByLabelText('Partager')).toBeOnTheScreen()
  })

  it('should fully display the title at the end of the animation', () => {
    const { animatedValue } = renderVenueHeader()

    expect(screen.getByTestId('venueHeaderName').props.accessibilityHidden).toBe(true)
    expect(screen.getByTestId('venueHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, {
        duration: 100,
        toValue: 1,
        useNativeDriver: false,
      }).start()
      jest.runAllTimers()
    })

    expect(screen.getByTestId('venueHeaderName').props.accessibilityHidden).toBe(false)
    expect(screen.getByTestId('venueHeaderName').props.style.opacity).toBe(1)
  })

  it('should log analytics when clicking on the share button', async () => {
    renderVenueHeader()

    const shareButton = screen.getByLabelText('Partager')
    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Venue',
      from: 'venue',
      venueId: venueDataTest.id,
    })
  })

  describe('onBackPress', () => {
    it('should call goBack when enableVenueSurvey FF is deactivated', async () => {
      setFeatureFlags([])

      renderVenueHeader({ venue: venueWithSurveyActivity })
      await user.press(screen.getByLabelText('Revenir en arrière'))

      expect(mockGoBack).toHaveBeenCalledTimes(1)
      expect(navigate).not.toHaveBeenCalled()
    })

    describe('When enableVenueSurvey FF is activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_VENUE_SURVEY])
      })

      it('should navigate to VenueSurveyModal when user stayed under 5s and survey was not already seen', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueHeader({ venue: venueWithSurveyActivity })

        jest.advanceTimersByTime(2000)

        await user.press(screen.getByLabelText('Revenir en arrière'))

        expect(navigate).toHaveBeenCalledWith('VenueSurveyModal', {
          activity: Activity.BOOKSTORE,
        })
        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it('should call goBack when user stayed 5s or more', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueHeader({ venue: venueWithSurveyActivity })

        jest.advanceTimersByTime(5000)

        await user.press(screen.getByLabelText('Revenir en arrière'))

        expect(mockGoBack).toHaveBeenCalledTimes(1)
        expect(navigate).not.toHaveBeenCalled()
      })

      it('should call goBack when survey has already been accessed in storage', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(true)

        renderVenueHeader({ venue: venueWithSurveyActivity })

        jest.advanceTimersByTime(1000)

        await user.press(screen.getByLabelText('Revenir en arrière'))

        expect(mockGoBack).toHaveBeenCalledTimes(1)
        expect(navigate).not.toHaveBeenCalled()
      })
    })
  })
})

const renderVenueHeader = ({ venue = venueDataTest }: { venue?: VenueResponse } = {}) => {
  const animatedValue = new Animated.Value(0)
  render(reactQueryProviderHOC(<VenueHeader headerTransition={animatedValue} venue={venue} />))
  return { animatedValue }
}
