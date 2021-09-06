import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils/web'

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

  // FIXME: Web Integration
  it.skip('should have count in title when searching Around me [WEB INTEGRATION]', () => {
    mockSearchState = { ...mockSearchState, locationType: LocationType.AROUND_ME }
    expect(render(<Location />).queryByText(countString)).toBeTruthy()
  })

  // FIXME: Web Integration
  it.skip('should have count in title when searching Place [WEB INTEGRATION]', () => {
    mockSearchState = { ...mockSearchState, locationType: LocationType.PLACE }
    expect(render(<Location />).queryByText(countString)).toBeTruthy()
  })

  // FIXME: Web Integration
  it.skip('should navigate to the offer when clicking on the hit [WEB INTEGRATION]', () => {
    fireEvent.click(render(<Location />).getByTestId('changeLocation'))
    expect(navigate).toHaveBeenCalledWith('LocationFilter')
  })
})
