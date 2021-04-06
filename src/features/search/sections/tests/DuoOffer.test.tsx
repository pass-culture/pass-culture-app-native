import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { DuoOffer } from '../DuoOffer'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
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
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_DUO' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<DuoOffer />).queryByText('Uniquement les offres duo')).toBeTruthy()
    expect(render(<DuoOffer />).queryByText('Uniquement les offres duo\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, offerIsDuo: true }
    expect(render(<DuoOffer />).queryByText('Uniquement les offres duo\xa0(1)')).toBeTruthy()
  })
})
