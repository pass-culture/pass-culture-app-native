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

const testID = 'Interrupteur'

describe('NewOffer component', () => {
  it('should be controlled by searchState.offerIsNew', () => {
    let { parent } = render(<NewOffer />).getByTestId(testID)
    expect(parent?.props.accessibilityState.checked).toBeFalsy()

    mockSearchState = { ...initialSearchState, offerIsNew: true }
    parent = render(<NewOffer />).getByTestId(testID).parent
    expect(parent?.props.accessibilityState.checked).toBeTruthy()
  })

  it('should dispatch TOGGLE_OFFER_NEW onPress', () => {
    const { getByTestId } = render(<NewOffer />)
    fireEvent.press(getByTestId(testID))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_NEW' })
  })
})
