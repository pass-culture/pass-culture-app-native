import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { NewOffer } from '../NewOffer'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('NewOffer component', () => {
  it('should be controlled by searchState.offerIsNew', () => {
    expect(render(<NewOffer />).getByTestId('filterSwitch').props.value).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsNew: true }
    expect(render(<NewOffer />).getByTestId('filterSwitch').props.value).toBeTruthy()
  })
  it('should dispatch TOGGLE_OFFER_NEW onPress', () => {
    const { getByTestId } = render(<NewOffer />)
    getByTestId('filterSwitch').props.onChange({ nativeEvent: { value: true } })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_NEW' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<NewOffer />).queryByText('Uniquement les nouveautés')).toBeTruthy()
    expect(render(<NewOffer />).queryByText('Uniquement les nouveautés\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsNew: true }
    expect(render(<NewOffer />).queryByText('Uniquement les nouveautés\xa0(1)')).toBeTruthy()
  })
})
