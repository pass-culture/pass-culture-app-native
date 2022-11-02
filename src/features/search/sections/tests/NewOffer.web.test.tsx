import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils/web'

import { NewOffer } from '../NewOffer'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const testID = 'Interrupteur'

describe('NewOffer component', () => {
  it('should dispatch TOGGLE_OFFER_NEW onPress', () => {
    const { getByTestId } = render(<NewOffer />)
    fireEvent.click(getByTestId(testID))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_NEW' })
  })
})
