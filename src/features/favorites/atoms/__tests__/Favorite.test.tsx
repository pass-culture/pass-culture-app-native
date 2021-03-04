import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FavoriteCategoryResponse, FavoriteResponse } from 'api/gen'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Favorite } from '../Favorite'

const mockFavoritesState = initialFavoritesState

let mockDistance: string | null = null
jest.mock('features/offer/components/useDistance', () => ({
  useDistance: () => mockDistance,
}))

jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavorites: () => ({
    favoritesState: mockFavoritesState,
  }),
}))

const favorite: FavoriteResponse = {
  id: 393,
  offer: {
    category: {
      categoryType: 'Event',
      label: 'Pratique artistique',
      name: 'LECON',
    } as FavoriteCategoryResponse,
    coordinates: { latitude: 48.9263, longitude: 2.49008 },
    date: null,
    externalTicketOfficeUrl: null,
    id: 146105,
    image: {
      credit: null,
      url:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWMA',
    },
    name: 'Un lit sous une rivière',
    price: null,
    startDate: new Date('2021-03-04T20:00:00'),
    startPrice: 2700,
  },
}

describe('Favorite component', () => {
  it('should navigate to the offer when clicking on the favorite', () => {
    const { getByTestId } = render(reactQueryProviderHOC(<Favorite favorite={favorite} />))
    fireEvent.press(getByTestId('favorite'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: favorite.offer.id,
      shouldDisplayLoginModal: false,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    const { queryByText } = render(reactQueryProviderHOC(<Favorite favorite={favorite} />))
    expect(queryByText('10 km')).toBeTruthy()
  })

  it('offer name should take full space if no geolocation', () => {
    mockDistance = '10 km'
    const withDistance = render(reactQueryProviderHOC(<Favorite favorite={favorite} />)).toJSON()

    mockDistance = null
    const withoutDistance = render(reactQueryProviderHOC(<Favorite favorite={favorite} />)).toJSON()
    expect(withoutDistance).toMatchDiffSnapshot(withDistance)
  })
})
