import React from 'react'

import { useUserProfileInfo } from 'features/profile/api'
import { LocationType } from 'features/search/enums'
import { SectionTitle } from 'features/search/sections/titles'
import { SuggestedPlace } from 'libs/place'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
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
  it('should render correctly', () => {
    mockSearchState.locationFilter = { locationType: LocationType.AROUND_ME, aroundRadius: 100 }
    const { toJSON } = renderSearchFilter()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not render section Radius if search everywhere or venue selected', () => {
    mockSearchState.locationFilter = { locationType: LocationType.EVERYWHERE }
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeNull()

    mockSearchState.locationFilter = { locationType: LocationType.AROUND_ME, aroundRadius: 100 }
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeTruthy()

    // Address
    mockSearchState.locationFilter = {
      locationType: LocationType.PLACE,
      aroundRadius: 10,
      place: Kourou,
    }
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeTruthy()

    // Venue
    mockSearchState.locationFilter = {
      locationType: LocationType.VENUE,
      venue: { ...Kourou, venueId: 4 },
    }
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeNull()
  })

  it('should not render Duo filter if user not beneficiary', () => {
    useUserProfileInfoMock.mockImplementationOnce(() => ({ data: { isBeneficiary: false } }))
    const { queryByTestId } = renderSearchFilter()
    expect(queryByTestId('duoFilter')).toBeNull()
  })
})
