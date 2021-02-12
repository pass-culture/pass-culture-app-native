import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { NewOffer } from '../NewOffer'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('NewOffer component', () => {
  it('should be controlled by searchState.offerIsNew', () => {
    expect(render(<NewOffer />).getByTestId('switchBackground').props.active).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsNew: true }
    expect(render(<NewOffer />).getByTestId('switchBackground').props.active).toBeTruthy()
  })
  it('should dispatch TOGGLE_OFFER_NEW onPress', () => {
    const { getByTestId } = render(<NewOffer />)
    fireEvent.press(getByTestId('filterSwitch'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_NEW' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<NewOffer />).queryByText('Uniquement les nouveautés')).toBeTruthy()
    expect(render(<NewOffer />).queryByText('Uniquement les nouveautés\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsNew: true }
    expect(render(<NewOffer />).queryByText('Uniquement les nouveautés\xa0(1)')).toBeTruthy()
  })
})
