import React from 'react'
import { Animated, Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { Activity, PaginatedResponseFavoriteVenueResponse, VenueResponse } from 'api/gen'
import { FavoriteType } from 'features/favorites/enum'
import { favoriteVenueResponseSnap } from 'features/favorites/fixtures/favoriteVenueResponseSnap'
import { paginatedVenueFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedVenueFavoritesResponseSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import { UserProfile } from 'features/share/types'
import { VenueHeader } from 'features/venue/components/VenueHeader/VenueHeader'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import * as venueSurveyAccessStorageModule from 'features/venue/helpers/venueSurveyAccessStorage'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useVenueFavoritesQuery } from 'queries/favorites/useFavoritesQuery'
import {
  mockAuthContextWithoutUser,
  mockAuthContextWithUser,
  mockUseAuthContext,
} from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'

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
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const mockCheckVenueSurveyAccess = jest.spyOn(
  venueSurveyAccessStorageModule,
  'checkVenueSurveyAccess'
)

const mockLoggedInUser = () => {
  mockUseAuthContext.mockReset()
  mockAuthContextWithUser(beneficiaryUser, { persist: true })
}

const spyApiDeleteFavorite = jest.spyOn(api, 'deleteNativeV2MeFavoritesVenuesfavoriteId')
const spyApiPostFavorite = jest.spyOn(api, 'postNativeV2MeFavoritesVenues')

const mockUseVenueFavoritesQuery = useVenueFavoritesQuery as jest.Mock
jest.mock('queries/favorites/useFavoritesQuery', () => ({
  useVenueFavoritesQuery: jest.fn(),
}))

const user = userEvent.setup()
jest.useFakeTimers()

const venueWithSurveyActivity: VenueResponse = {
  ...venueDataTest,
  activity: Activity.BOOKSTORE,
}

describe('<VenueHeader />', () => {
  beforeEach(() => {
    setFeatureFlags([])
    mockUseVenueFavoritesQuery.mockReturnValue({ data: favoriteVenueResponseSnap })
    mockServer.getApi<UserProfile>(`/v1/me`, beneficiaryUser)
    spyApiDeleteFavorite.mockResolvedValue({})
    spyApiPostFavorite.mockResolvedValue(favoriteVenueResponseSnap)
    mockAuthContextWithoutUser()
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

      it('should navigate to VenueSurveyModal when user stayed more 5s and survey was not already seen', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueHeader({ venue: venueWithSurveyActivity })

        jest.advanceTimersByTime(6000)

        await user.press(screen.getByLabelText('Revenir en arrière'))

        expect(navigate).toHaveBeenCalledWith('VenueSurveyModal', {
          activity: Activity.BOOKSTORE,
        })
        expect(mockGoBack).not.toHaveBeenCalled()
      })

      it('should call goBack when user stayed 5s or less', async () => {
        mockCheckVenueSurveyAccess.mockResolvedValueOnce(false)

        renderVenueHeader({ venue: venueWithSurveyActivity })

        jest.advanceTimersByTime(4000)

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

  describe('Favorite button', () => {
    describe('When wipFavoritesHub FF activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
      })

      describe('When venue is in favorites', () => {
        const expectedFavoriteId = paginatedVenueFavoritesResponseSnap.favorites[0].id

        beforeEach(() => {
          mockServer.getApi<PaginatedResponseFavoriteVenueResponse>(
            `/v2/me/favorites/venues`,
            paginatedVenueFavoritesResponseSnap
          )
          mockLoggedInUser()
        })

        it('should remove favorite when press on favorite', async () => {
          renderVenueHeader()

          const button = await screen.findByLabelText('Retirer des favoris')
          await user.press(button)

          await waitFor(() => {
            expect(spyApiDeleteFavorite).toHaveBeenCalledWith(expectedFavoriteId)
          })
        })

        it('should display snackbar when remove favorite fails', async () => {
          spyApiDeleteFavorite.mockRejectedValueOnce({ status: 400 })

          renderVenueHeader()

          const button = await screen.findByLabelText('Retirer des favoris')
          await user.press(button)

          expect(
            await screen.findByText('Le lieu n’a pas été retiré de tes favoris')
          ).toBeOnTheScreen()
          expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
          expect(spyApiDeleteFavorite).toHaveBeenCalledWith(expectedFavoriteId)
        })
      })

      describe('When venue is not in favorites', () => {
        beforeEach(() => {
          mockUseVenueFavoritesQuery.mockReturnValue({ data: null })
          mockLoggedInUser()
        })

        it('should add favorite when press on favorite', async () => {
          renderVenueHeader()

          const button = await screen.findByLabelText('Mettre en favori')
          await user.press(button)

          await waitFor(() => {
            expect(spyApiPostFavorite).toHaveBeenCalledWith({ venueId: venueDataTest.id })
          })
        })

        it('should trigger AddItemToFavorite log when press on favorite', async () => {
          renderVenueHeader()

          const button = await screen.findByLabelText('Mettre en favori')
          await user.press(button)

          expect(analytics.logAddItemToFavorite).toHaveBeenCalledWith({
            id: venueDataTest.id.toString(),
            type: FavoriteType.VENUE,
            from: 'venue',
          })
        })
      })
    })

    describe('When wipFavoritesHub FF deactivated', () => {
      it('should not display favorite button and disable query', async () => {
        mockAuthContextWithUser(beneficiaryUser)
        renderVenueHeader()

        await screen.findAllByText(venueDataTest.name)

        expect(screen.queryByLabelText('Mettre en favori')).not.toBeOnTheScreen()
        expect(screen.queryByLabelText('Retirer des favoris')).not.toBeOnTheScreen()
        expect(mockUseVenueFavoritesQuery).toHaveBeenCalledWith(
          expect.objectContaining({ enabled: false })
        )
      })
    })
  })
})

const renderVenueHeader = ({ venue = venueDataTest }: { venue?: VenueResponse } = {}) => {
  const animatedValue = new Animated.Value(0)
  render(reactQueryProviderHOC(<VenueHeader headerTransition={animatedValue} venue={venue} />))
  return { animatedValue }
}
