import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaVenueResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates } from 'libs/geolocation'
import { render, screen } from 'tests/utils'

import { SearchListHeader } from './SearchListHeader'

const searchId = uuidv4()

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    userPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

const mockSearchVenuesState = mockedAlgoliaVenueResponse
jest.mock('features/search/context/SearchVenuesWrapper', () => ({
  useSearchVenues: () => ({
    searchVenuesState: mockSearchVenuesState,
    dispatch: jest.fn(),
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

describe('<SearchListHeader />', () => {
  it('should display the number of results', () => {
    useRoute.mockReturnValueOnce({
      params: { searchId },
    })
    render(<SearchListHeader nbHits={10} userData={[]} />)

    expect(screen.getByText('10 résultats')).toBeTruthy()
  })

  it('should not display the geolocation button if position is not null', () => {
    render(<SearchListHeader nbHits={10} userData={[]} />)
    expect(screen.queryByText('Géolocalise-toi')).toBeFalsy()
  })

  it('should display the geolocation incitation button when position is null', () => {
    mockPosition = null
    render(<SearchListHeader nbHits={10} userData={[]} />)

    expect(screen.getByText('Géolocalise-toi')).toBeTruthy()
  })

  it('should display paddingBottom when nbHits is greater than 0', () => {
    render(<SearchListHeader nbHits={10} userData={[{ message: 'message test' }]} />)
    const bannerContainer = screen.getByTestId('banner-container')
    expect(bannerContainer.props.style).toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  it('should not display paddingBottom when nbHits is equal to 0', () => {
    render(<SearchListHeader nbHits={0} userData={[{ message: 'message test' }]} />)
    const bannerContainer = screen.getByTestId('banner-container')
    expect(bannerContainer.props.style).not.toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  describe('When wipEnableVenuesInSearchResults feature flag activated', () => {
    it('should render venue items when there are venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(screen.getByTestId('search-venue-lit')).toBeTruthy()
    })

    it('should render venues nbHits', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.getByText('2 résultats')).toBeTruthy()
    })

    it('should not render venue items when there are not venues', () => {
      mockSearchVenuesState.hits = []
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByTestId('search-venue-lit')).toBeNull()
    })

    it('should not render venues nbHits', () => {
      mockSearchVenuesState.hits = []
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByText('2 résultats')).toBeNull()
    })
  })

  describe('When wipEnableVenuesInSearchResults feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should not render venue items when there are venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByTestId('search-venue-lit')).toBeNull()
    })

    it('should not render venues nbHits when there are venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByText('2 résultats')).toBeNull()
    })

    it('should not render venue items when there are not venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByTestId('search-venue-lit')).toBeNull()
    })

    it('should not render venues nbHits when there are not venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByText('2 résultats')).toBeNull()
    })
  })
})
