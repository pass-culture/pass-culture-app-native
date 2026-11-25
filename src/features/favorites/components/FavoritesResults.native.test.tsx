import { QueryObserverSuccessResult } from '@tanstack/react-query'
import React from 'react'
import { Text as MockText } from 'react-native'

import {
  FavoriteArtistResponse,
  FavoriteOfferResponseV2,
  FavoriteVenueResponse,
  PaginatedResponseFavoriteOfferResponseV2,
} from 'api/gen'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { FavoriteType } from 'features/favorites/enum'
import { favoriteArtistResponseSnap } from 'features/favorites/fixtures/favoriteArtistResponseSnap'
import { favoriteVenueResponseSnap } from 'features/favorites/fixtures/favoriteVenueResponseSnap'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { UserProfile } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  useArtistFavoritesQuery,
  useOfferFavoritesQuery,
  useVenueFavoritesQuery,
} from 'queries/favorites/useFavoritesQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

import { FavoritesResults } from './FavoritesResults'

let mockFocusEffect: (() => void) | undefined
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('__mocks__/@react-navigation/native'),
  useFocusEffect: (effect: () => void) => {
    mockFocusEffect = effect
    jest.requireActual('react').useEffect(effect, [effect])
  },
}))

const mockFavoritesState = initialFavoritesState
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

let mockUser: UserProfile | undefined = beneficiaryUser
let mockIsLoggedIn = true
jest.mock('features/auth/context/AuthContext', () => ({
  ...jest.requireActual('features/auth/context/AuthContext'),
  useAuthContext: () => ({ user: mockUser, isLoggedIn: mockIsLoggedIn }),
}))

jest.mock('queries/favorites/useFavoritesQuery')
const mockUseOfferFavorites = useOfferFavoritesQuery as jest.MockedFunction<
  typeof useOfferFavoritesQuery
>
const mockUseVenueFavorites = useVenueFavoritesQuery as jest.MockedFunction<
  typeof useVenueFavoritesQuery
>
const mockUseArtistFavorites = useArtistFavoritesQuery as jest.MockedFunction<
  typeof useArtistFavoritesQuery
>

jest.mock('features/favorites/components/FavoriteOffer', () => ({
  FavoriteOffer: ({ favorite }: { favorite: FavoriteOfferResponseV2 }) => {
    const Text = MockText
    return <Text>{favorite.offer.name}</Text>
  },
}))
jest.mock('features/favorites/components/FavoriteVenue', () => ({
  FavoriteVenue: ({ favorite }: { favorite: FavoriteVenueResponse }) => {
    const Text = MockText
    return <Text>{favorite.venue.name}</Text>
  },
}))
jest.mock('features/favorites/components/FavoriteArtist', () => ({
  FavoriteArtist: ({ favorite }: { favorite: FavoriteArtistResponse }) => {
    const Text = MockText
    return <Text>{favorite.artist.name}</Text>
  },
}))

jest.mock('features/bookOffer/pages/BookingOfferModal', () => ({
  BookingOfferModal() {
    const Text = MockText
    return <Text>BookingOfferModalMock</Text>
  },
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const emptyOffers = {
  nbFavorites: 0,
  favorites: [] as FavoriteOfferResponseV2[],
  page: 0,
} as PaginatedResponseFavoriteOfferResponseV2

const mockRefetchOffers = jest.fn()
const mockRefetchVenues = jest.fn()
const mockRefetchArtists = jest.fn()

const queryResult = (data: unknown, refetch: jest.Mock, overrides = {}) =>
  ({ data, isLoading: false, isFetching: false, refetch, ...overrides }) as unknown

function mockOffers(data: unknown = paginatedOfferFavoritesResponseSnap, overrides = {}) {
  mockUseOfferFavorites.mockReturnValue(
    queryResult(
      data,
      mockRefetchOffers,
      overrides
    ) as QueryObserverSuccessResult<PaginatedResponseFavoriteOfferResponseV2>
  )
}

function mockVenues(favorites: FavoriteVenueResponse[] = [], overrides = {}) {
  const data = { nbFavorites: favorites.length, favorites, page: 0 }

  mockUseVenueFavorites.mockReturnValue(
    queryResult(data, mockRefetchVenues, overrides) as ReturnType<typeof useVenueFavoritesQuery>
  )
}

function mockArtists(favorites: FavoriteArtistResponse[] = [], overrides = {}) {
  const data = { nbFavorites: favorites.length, favorites, page: 0 }

  mockUseArtistFavorites.mockReturnValue(
    queryResult(data, mockRefetchArtists, overrides) as ReturnType<typeof useArtistFavoritesQuery>
  )
}

const user = userEvent.setup()

describe('FavoritesResults component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFocusEffect = undefined
    mockUser = beneficiaryUser
    mockIsLoggedIn = true
    setFeatureFlags()
    mockOffers()
    mockVenues()
    mockArtists()
  })

  it('should show no result message when list is empty', async () => {
    mockOffers(emptyOffers)

    renderFavoritesResults()
    const button = await screen.findByText('Explorer')
    const sortByButton = screen.queryByText('Trier')

    expect(button).toBeTruthy()
    expect(sortByButton).not.toBeOnTheScreen()
  })

  it('should show favorite placeholder on init', async () => {
    mockOffers(undefined, { isLoading: true })

    renderFavoritesResults()
    const container = await screen.findByTestId('FavoritesResultsPlaceHolder')

    expect(container).toBeOnTheScreen()
  })

  it('should show number of result and sortBy button', async () => {
    renderFavoritesResults()
    const container = await screen.findByText(
      `${paginatedOfferFavoritesResponseSnap.nbFavorites} favoris`
    )

    expect(container).toBeOnTheScreen()

    const sortByButton = screen.getByText('Trier')

    expect(sortByButton).toBeOnTheScreen()
  })

  it('should render offers when user and credit are available', async () => {
    renderFavoritesResults()

    expect(await screen.findByText('Spectacle une seule date')).toBeOnTheScreen()
  })

  it('should not render offers when user is not available', async () => {
    mockUser = undefined

    renderFavoritesResults()
    await screen.findByText(`${paginatedOfferFavoritesResponseSnap.nbFavorites} favoris`)

    expect(screen.queryByText('Spectacle une seule date')).not.toBeOnTheScreen()
  })

  it('should display not connected view and disable queries when user is not logged in', async () => {
    mockIsLoggedIn = false
    mockUser = undefined

    renderFavoritesResults()

    expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
    expect(screen.queryByText('Trier')).not.toBeOnTheScreen()
    expect(mockUseOfferFavorites).toHaveBeenCalledWith({ enabled: false })
    expect(mockUseVenueFavorites).toHaveBeenCalledWith({ enabled: false })
    expect(mockUseArtistFavorites).toHaveBeenCalledWith({ enabled: false })
  })

  it('should display tabs panel when wipFavoritesHub FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])

    renderFavoritesResults()

    expect(await screen.findByLabelText('Types de favoris')).toBeOnTheScreen()
  })

  it('should not display tabs panel when wipFavoritesHub FF deactivated', async () => {
    renderFavoritesResults()

    await screen.findByText(`${paginatedOfferFavoritesResponseSnap.nbFavorites} favoris`)

    expect(screen.queryByLabelText('Types de favoris')).not.toBeOnTheScreen()
  })

  describe('with wipFavoritesHub FF activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
    })

    it('should display not connected view in every tab when user is not logged in', async () => {
      mockIsLoggedIn = false
      mockUser = undefined

      renderFavoritesResults()

      expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
      expect(screen.queryByText('Trier')).not.toBeOnTheScreen()

      await user.press(screen.getByText('Lieux'))

      expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()

      await user.press(screen.getByText('Artistes'))

      expect(await screen.findByText('Identifie-toi pour retrouver tes favoris')).toBeOnTheScreen()
      expect(mockUseOfferFavorites).toHaveBeenCalledWith({ enabled: false })
      expect(mockUseVenueFavorites).toHaveBeenCalledWith({ enabled: false })
      expect(mockUseArtistFavorites).toHaveBeenCalledWith({ enabled: false })
    })

    it('should display venue favorites in venues tab', async () => {
      mockVenues([favoriteVenueResponseSnap])
      renderFavoritesResults()

      await user.press(await screen.findByText('Lieux'))

      expect(await screen.findByText(favoriteVenueResponseSnap.venue.name)).toBeOnTheScreen()
    })

    it('should display artist favorites in artists tab', async () => {
      mockArtists([favoriteArtistResponseSnap])
      renderFavoritesResults()

      await user.press(await screen.findByText('Artistes'))

      expect(await screen.findByText(favoriteArtistResponseSnap.artist.name)).toBeOnTheScreen()
    })

    it('should show no result message in venues tab when list is empty', async () => {
      renderFavoritesResults()

      await user.press(await screen.findByText('Lieux'))

      expect(await screen.findByText('Explorer')).toBeOnTheScreen()
    })

    it('should show no result message in artists tab when list is empty', async () => {
      renderFavoritesResults()

      await user.press(await screen.findByText('Artistes'))

      expect(await screen.findByText('Explorer')).toBeOnTheScreen()
    })

    it('should show placeholder in venues tab while venues are loading', async () => {
      mockVenues([], { isLoading: true })
      renderFavoritesResults()

      await user.press(await screen.findByText('Lieux'))

      expect(await screen.findByTestId('FavoritesResultsPlaceHolder')).toBeOnTheScreen()
    })

    it('should show placeholder in artists tab while artists are loading', async () => {
      mockArtists([], { isLoading: true })
      renderFavoritesResults()

      await user.press(await screen.findByText('Artistes'))

      expect(await screen.findByTestId('FavoritesResultsPlaceHolder')).toBeOnTheScreen()
    })

    it('should not block offers tab while venues are loading', async () => {
      mockVenues([], { isLoading: true })
      renderFavoritesResults()

      expect(await screen.findByText('Spectacle une seule date')).toBeOnTheScreen()
      expect(screen.queryByTestId('FavoritesResultsPlaceHolder')).not.toBeOnTheScreen()
    })

    it('should show sort button only in offers tab', async () => {
      mockVenues([favoriteVenueResponseSnap])
      renderFavoritesResults()

      expect(await screen.findByText('Trier')).toBeOnTheScreen()

      await user.press(screen.getByText('Lieux'))

      expect(screen.queryByText('Trier')).not.toBeOnTheScreen()
    })

    it('should refetch only venues when pulling to refresh in venues tab', async () => {
      mockVenues([favoriteVenueResponseSnap])
      renderFavoritesResults()

      await user.press(await screen.findByText('Lieux'))
      fireEvent(await screen.findByTestId('favoritesResultsFlatlist'), 'refresh')

      expect(mockRefetchVenues).toHaveBeenCalledTimes(1)
      expect(mockRefetchOffers).not.toHaveBeenCalled()
      expect(mockRefetchArtists).not.toHaveBeenCalled()
    })
  })

  describe('logConsultFavorites', () => {
    it('should log consult favorites for offers tab on mount when user is logged in', async () => {
      renderFavoritesResults()

      await screen.findByText('Spectacle une seule date')

      expect(analytics.logConsultFavorites).toHaveBeenNthCalledWith(1, { tab: FavoriteType.OFFER })
    })

    it('should not log consult favorites on mount when user is not logged in', async () => {
      mockIsLoggedIn = false

      renderFavoritesResults()

      await screen.findByText('Spectacle une seule date')

      expect(analytics.logConsultFavorites).not.toHaveBeenCalled()
    })

    describe('with wipFavoritesHub FF activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_FAVORITES_HUB])
      })

      it('should not log consult favorites when pressing the selected tab', async () => {
        renderFavoritesResults()

        await user.press(await screen.findByText('Offres'))

        expect(analytics.logConsultFavorites).toHaveBeenNthCalledWith(1, {
          tab: FavoriteType.OFFER,
        })
      })

      it('should log consult favorites for the selected tab when focused again', async () => {
        renderFavoritesResults()

        await user.press(await screen.findByText('Lieux'))

        expect(analytics.logConsultFavorites).toHaveBeenNthCalledWith(1, {
          tab: FavoriteType.OFFER,
        })

        act(() => mockFocusEffect?.())

        expect(analytics.logConsultFavorites).toHaveBeenNthCalledWith(2, {
          tab: FavoriteType.VENUE,
        })
      })

      it.each`
        tabLabel      | expectedType
        ${'Lieux'}    | ${FavoriteType.VENUE}
        ${'Artistes'} | ${FavoriteType.ARTIST}
      `(
        'should log consult favorites for $tabLabel tab when pressed',
        async ({ tabLabel, expectedType }) => {
          renderFavoritesResults()

          await screen.findByLabelText('Types de favoris')

          await user.press(screen.getByText(tabLabel))

          expect(analytics.logConsultFavorites).toHaveBeenNthCalledWith(2, { tab: expectedType })
        }
      )

      it('should log consult favorites for offers tab when going back to it', async () => {
        renderFavoritesResults()
        await user.press(await screen.findByText('Lieux'))

        await user.press(screen.getByText('Offres'))

        expect(analytics.logConsultFavorites).toHaveBeenNthCalledWith(3, {
          tab: FavoriteType.OFFER,
        })
      })
    })
  })
})

function renderFavoritesResults() {
  return render(reactQueryProviderHOC(<FavoritesResults />))
}
