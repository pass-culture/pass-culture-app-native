import mockdate from 'mockdate'
import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import {
  ExpenseDomain,
  FavoriteResponse,
  SubcategoriesResponseModelv2,
  YoungStatusType,
} from 'api/gen'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { favoriteResponseSnap as favorite } from 'features/favorites/fixtures/favoriteResponseSnap'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { EmptyResponse } from 'libs/fetch'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Credit } from 'shared/user/useAvailableCredit'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { Favorite } from './Favorite'

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const credit: Credit = { amount: 100, isExpired: false }

const userProfile: UserProfileResponseWithoutSurvey = {
  isBeneficiary: true,
  bookedOffers: {},
  domainsCredit: { [ExpenseDomain.all]: { initial: 500, remaining: 300 } },
  status: {
    statusType: YoungStatusType.beneficiary,
  },
} as UserProfileResponseWithoutSurvey
const onInAppBooking = jest.fn()

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    favoritesState: mockFavoritesState,
  }),
}))
jest.mock('libs/jwt/jwt')

const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const DEFAULT_USER_LOCATION = { latitude: 48, longitude: -1 }

const EVERYWHERE_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
}

const AROUND_ME_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
  place: null,
}

const mockUseLocation: jest.Mock<Partial<ILocationContext>> = jest.fn(
  () => EVERYWHERE_USER_POSITION
)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<Favorite /> component', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
    setFeatureFlags()
  })

  it('should navigate to the offer when clicking on the favorite', async () => {
    renderFavorite()

    const offre = screen.getByText(favorite.offer.name)
    await user.press(offre)

    expect(navigate).toHaveBeenCalledWith('Offer', {
      from: 'favorites',
      id: favorite.offer.id,
    })
  })

  describe('user has chosen geolocation', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue(AROUND_ME_POSITION)
    })

    it('should show distance', async () => {
      renderFavorite()
      await screen.findByLabelText(`Partager l’offre ${favorite.offer.name}`)

      expect(await screen.findByText('19 km')).toBeOnTheScreen()
    })
  })

  it('should delete favorite on button click', async () => {
    const deleteFavoriteSpy = jest.spyOn(api, 'deleteNativeV1MeFavoritesfavoriteId')
    simulateBackend()

    renderFavorite()

    await user.press(screen.getByText('Supprimer'))

    await waitFor(() => {
      expect(deleteFavoriteSpy).toHaveBeenNthCalledWith(1, favorite.id)
      expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
    })
  })

  it('should fail to delete favorite on button click', async () => {
    const deleteFavoriteSpy = jest.spyOn(api, 'deleteNativeV1MeFavoritesfavoriteId')
    const id = 0
    simulateBackend({ id, hasRemoveFavoriteError: true })

    renderFavorite({
      favorite: { ...favorite, id, offer: { ...favorite.offer, id } },
    })

    await user.press(screen.getByText('Supprimer'))

    await waitFor(() => {
      expect(deleteFavoriteSpy).toHaveBeenNthCalledWith(1, id)
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should call share when press share icon', async () => {
    renderFavorite()

    const shareButton = await screen.findByLabelText(`Partager l’offre ${favorite.offer.name}`)
    await user.press(shareButton)

    expect(shareSpy).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when press share icon', async () => {
    renderFavorite()

    const shareButton = await screen.findByLabelText(`Partager l’offre ${favorite.offer.name}`)
    await user.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'favorites',
      offerId: favorite.offer.id,
    })
  })

  describe('coming soon offer', () => {
    const TODAY = '2025-07-29T15:15:00Z'
    const TODAY_PLUS_ONE_MINUTE = '2025-07-29T15:16:00Z'

    beforeAll(() => mockdate.set(new Date(TODAY)))

    it('should not show booking button on an offer not yet bookable', async () => {
      renderFavorite({
        favorite: {
          ...favorite,
          offer: { ...favorite.offer, bookingAllowedDatetime: TODAY_PLUS_ONE_MINUTE },
        },
      })

      await screen.findByText(favorite.offer.name)

      expect(screen.queryByText('Réserver')).not.toBeOnTheScreen()
    })

    it('should show booking button on a bookable offer', async () => {
      renderFavorite({
        favorite: {
          ...favorite,
          offer: { ...favorite.offer, bookingAllowedDatetime: TODAY },
        },
      })

      await screen.findByText(favorite.offer.name)

      expect(await screen.findByText('Réserver')).toBeOnTheScreen()
    })
  })
})

type Options = {
  id?: number
  hasRemoveFavoriteError?: boolean
}

const DEFAULT_GET_FAVORITE_OPTIONS = {
  id: favorite.id,
  hasRemoveFavoriteError: false,
}

function simulateBackend(options: Options = DEFAULT_GET_FAVORITE_OPTIONS) {
  const { id, hasRemoveFavoriteError } = { ...DEFAULT_GET_FAVORITE_OPTIONS, ...options }
  mockServer.deleteApi<EmptyResponse>(`/v1/me/favorites/${id}`, {
    responseOptions: {
      statusCode: hasRemoveFavoriteError ? 422 : 204,
      data: {},
    },
  })
}

const DEFAULT_PROPS = {
  credit,
  favorite,
  userProfile,
  onInAppBooking,
}

type RenderFavoriteParams = {
  favorite?: FavoriteResponse
  user?: UserProfileResponseWithoutSurvey
}

function renderFavorite(props: RenderFavoriteParams = DEFAULT_PROPS) {
  const { favorite, userProfile } = { ...DEFAULT_PROPS, ...props }
  return render(
    reactQueryProviderHOC(
      <Favorite favorite={favorite} user={userProfile} onInAppBooking={onInAppBooking} />
    )
  )
}
