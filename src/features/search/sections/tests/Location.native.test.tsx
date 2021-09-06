import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { Location } from '../Location'

let mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
  }),
}))

describe('Location section', () => {
  const countString = '\xa0(1)'

  it('should not have count in title', () => {
    expect(render(<Location />).queryByText(countString)).toBeNull()
  })

  it('should have count in title when searching Around me', () => {
    mockSearchState = { ...mockSearchState, locationType: LocationType.AROUND_ME }
    expect(render(<Location />).queryByText(countString)).toBeTruthy()
  })

  it('should have count in title when searching Place', () => {
    mockSearchState = { ...mockSearchState, locationType: LocationType.PLACE }
    expect(render(<Location />).queryByText(countString)).toBeTruthy()
  })

  it('should navigate to the offer when clicking on the hit', () => {
    fireEvent.press(render(<Location />).getByTestId('changeLocation'))
    expect(navigate).toBeCalledWith('LocationFilter', { from: 'filters' })
  })
})
