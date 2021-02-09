import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { DuoOffer } from '../DuoOffer'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('DuoOffer component', () => {
  it('should be controlled by searchState.offerIsDuo', () => {
    expect(render(<DuoOffer />).getByTestId('switchBackground').props.active).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsDuo: true }
    expect(render(<DuoOffer />).getByTestId('switchBackground').props.active).toBeTruthy()
  })
  it('should dispatch TOGGLE_OFFER_DUO onPress', () => {
    const { getByTestId } = render(<DuoOffer />)
    fireEvent.press(getByTestId('filterSwitch'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_DUO' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<DuoOffer />).queryByText('Uniquement les offres duo')).toBeTruthy()
    expect(render(<DuoOffer />).queryByText('Uniquement les offres duo\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsDuo: true }
    expect(render(<DuoOffer />).queryByText('Uniquement les offres duo\xa0(1)')).toBeTruthy()
  })
})
