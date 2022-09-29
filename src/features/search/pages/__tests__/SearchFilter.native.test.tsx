import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useUserProfileInfo } from 'features/profile/api'
import { LocationType } from 'features/search/enums'
import { SectionTitle } from 'features/search/sections/titles'
import { SuggestedPlace } from 'libs/place'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, act } from 'tests/utils'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

const mockStagedSearchState = initialSearchState
const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockStagedSearchState,
    dispatch: jest.fn(),
  }),
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
}))

const useUserProfileInfoMock = useUserProfileInfo as jest.Mock

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
describe('SearchFilter component', () => {
  it('should render correctly', async () => {
    mockStagedSearchState.locationFilter = {
      locationType: LocationType.AROUND_ME,
      aroundRadius: 100,
    }
    const { toJSON } = renderSearchFilter()
    await act(async () => {
      expect(toJSON()).toMatchSnapshot()
    })
  })

  it('should render section Radius when search around me', async () => {
    mockStagedSearchState.locationFilter = {
      locationType: LocationType.AROUND_ME,
      aroundRadius: 100,
    }
    const { queryByText } = renderSearchFilter()
    await act(async () => {
      expect(queryByText(SectionTitle.Radius)).toBeTruthy()
    })
  })

  it('should render section Radius when search place', async () => {
    // Address
    mockStagedSearchState.locationFilter = {
      locationType: LocationType.PLACE,
      aroundRadius: 10,
      place: Kourou,
    }
    const { queryByText } = renderSearchFilter()
    await act(async () => {
      expect(queryByText(SectionTitle.Radius)).toBeTruthy()
    })
  })

  it('should not render section Radius when search everywhere', async () => {
    mockStagedSearchState.locationFilter = { locationType: LocationType.EVERYWHERE }
    const { queryByText } = renderSearchFilter()
    await act(async () => {
      expect(queryByText(SectionTitle.Radius)).toBeNull()
    })
  })

  it('should not render section Radius when search venue', async () => {
    // Venue
    mockStagedSearchState.locationFilter = {
      locationType: LocationType.VENUE,
      venue: { ...Kourou, venueId: 4 },
    }
    const { queryByText } = renderSearchFilter()
    await act(async () => {
      expect(queryByText(SectionTitle.Radius)).toBeNull()
    })
  })

  it('should not render Duo filter if user not beneficiary', async () => {
    useUserProfileInfoMock.mockImplementationOnce(() => ({ data: { isBeneficiary: false } }))
    const { queryByTestId } = renderSearchFilter()
    await act(async () => {
      expect(queryByTestId('duoFilter')).toBeNull()
    })
  })

  it('should navigate on search results with the current search state when pressing go back', async () => {
    const { getByTestId } = renderSearchFilter()

    await act(async () => {
      fireEvent.press(getByTestId('backButton'))
    })

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: mockSearchState,
      screen: 'Search',
    })
  })
})
