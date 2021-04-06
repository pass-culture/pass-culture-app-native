import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { FreeOffer } from '../FreeOffer'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('FreeOffer component', () => {
  it('should be controlled by searchState.offerIsFree', () => {
    expect(render(<FreeOffer />).getByTestId('switchBackground').props.active).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsFree: true }
    expect(render(<FreeOffer />).getByTestId('switchBackground').props.active).toBeTruthy()
  })
  it('should dispatch TOGGLE_OFFER_FREE onPress', () => {
    const { getByTestId } = render(<FreeOffer />)
    fireEvent.press(getByTestId('filterSwitch'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_FREE' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<FreeOffer />).queryByText('Uniquement les offres gratuites')).toBeTruthy()
    expect(render(<FreeOffer />).queryByText('Uniquement les offres gratuites\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsFree: true }
    expect(render(<FreeOffer />).queryByText('Uniquement les offres gratuites\xa0(1)')).toBeTruthy()
  })
})
