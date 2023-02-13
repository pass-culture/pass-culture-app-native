import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { UserData } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'
import { render, screen } from 'tests/utils'

import { ListHeaderComponent } from './ListHeaderComponent'

const searchId = uuidv4()

const mockUserData: UserData[] = []
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    userData: mockUserData,
  }),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

describe('<ListHeaderComponent />', () => {
  it('should display the number of results', () => {
    useRoute.mockReturnValueOnce({
      params: { searchId },
    })
    render(<ListHeaderComponent nbHits={10} />)

    expect(screen.getByText('10 résultats')).toBeTruthy()
  })

  it('should not display the geolocation button if position is not null', () => {
    render(<ListHeaderComponent nbHits={10} />)
    expect(screen.queryByText('Géolocalise-toi')).toBeFalsy()
  })

  it('should display the geolocation incitation button when position is null', () => {
    mockPosition = null
    render(<ListHeaderComponent nbHits={10} />)

    expect(screen.getByText('Géolocalise-toi')).toBeTruthy()
  })
})
