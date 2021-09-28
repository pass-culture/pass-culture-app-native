import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { NewOffer } from '../NewOffer'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

const testID = 'Interrupteur filtre nouvelles offres'

describe('NewOffer component', () => {
  it('should be controlled by searchState.offerIsNew', () => {
    let { parent } = render(<NewOffer />).getByTestId(testID)
    expect(parent?.props.accessibilityValue.text).toBe('false')

    mockSearchState = { ...initialSearchState, offerIsNew: true }
    parent = render(<NewOffer />).getByTestId(testID).parent
    expect(parent?.props.accessibilityValue.text).toBe('true')
  })

  it('should dispatch TOGGLE_OFFER_NEW onPress', () => {
    const { getByTestId } = render(<NewOffer />)
    fireEvent.press(getByTestId(testID))
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
