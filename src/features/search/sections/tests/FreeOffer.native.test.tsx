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

const testID = 'Interrupteur filtre offres gratuites'

describe('FreeOffer component', () => {
  it('should be controlled by searchState.offerIsFree', () => {
    let { parent } = render(<FreeOffer />).getByTestId(testID)
    expect(parent?.props.accessibilityValue.text).toBe('false')

    mockSearchState = { ...initialSearchState, offerIsFree: true }
    parent = render(<FreeOffer />).getByTestId(testID).parent
    expect(parent?.props.accessibilityValue.text).toBe('true')
  })

  it('should dispatch TOGGLE_OFFER_FREE onPress', () => {
    const { getByTestId } = render(<FreeOffer />)
    fireEvent.press(getByTestId(testID))
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
