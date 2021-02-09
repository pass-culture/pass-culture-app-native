import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { FreeOffer } from '../FreeOffer'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
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
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_FREE' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<FreeOffer />).queryByText('Uniquement les offres gratuites')).toBeTruthy()
    expect(render(<FreeOffer />).queryByText('Uniquement les offres gratuites\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsFree: true }
    expect(render(<FreeOffer />).queryByText('Uniquement les offres gratuites\xa0(1)')).toBeTruthy()
  })
})
