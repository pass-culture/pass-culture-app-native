import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils/web'

import { Location } from '../Location'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const Kourou = { label: 'Kourou', info: 'Guyane', geolocation: { latitude: 2, longitude: 3 } }

describe('Location section', () => {
  const titleCountID = 'titleCount'
  const countString = '\xa0(1)'

  it('should not have count in title', () => {
    expect(render(<Location />).queryByTestId(titleCountID)).toBeNull()
  })

  it('should have count in title when searching Around me [WEB INTEGRATION]', async () => {
    mockSearchState.locationFilter = {
      locationType: LocationType.AROUND_ME,
      aroundRadius: 20,
    }
    expect(render(<Location />).getByTestId(titleCountID).textContent).toBe(countString)
  })

  it('should have count in title when searching Place [WEB INTEGRATION]', () => {
    mockSearchState.locationFilter = {
      locationType: LocationType.PLACE,
      place: Kourou,
      aroundRadius: 20,
    }
    expect(render(<Location />).getByTestId(titleCountID).textContent).toBe(countString)
  })

  it('should navigate to the offer when clicking on the hit', () => {
    fireEvent.click(render(<Location />).getByTestId('changeLocation'))
    expect(navigate).toHaveBeenCalledWith('LocationFilter')
  })
})
