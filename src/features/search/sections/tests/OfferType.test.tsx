import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { OfferType, OFFER_TYPES } from '../OfferType'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('OfferType component', () => {
  it('should render all offer types', () => {
    const { queryByText } = render(<OfferType />)
    OFFER_TYPES.map(([, label]) => {
      expect(queryByText(label)).toBeTruthy()
    })
  })
  it('should dispatch OFFER_TYPE with correct offerType', () => {
    const { getByText } = render(<OfferType />)
    fireEvent.press(getByText('Offre numérique'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'OFFER_TYPE',
      payload: 'isDigital',
    })
  })

  it.each`
    isDigital | isEvent  | isThing  | count
    ${false}  | ${false} | ${false} | ${0}
    ${true}   | ${false} | ${false} | ${1}
    ${false}  | ${true}  | ${false} | ${1}
    ${false}  | ${false} | ${true}  | ${1}
    ${true}   | ${true}  | ${false} | ${2}
    ${false}  | ${true}  | ${true}  | ${2}
    ${true}   | ${false} | ${true}  | ${2}
    ${true}   | ${true}  | ${true}  | ${3}
  `(
    'should have the indicator $count in the title (isDigital=$isDigital | isEvent=$isEvent | isThing=$isThing)',
    ({ isDigital, isEvent, isThing, count }) => {
      mockSearchState = {
        ...initialSearchState,
        offerTypes: { isDigital, isEvent, isThing },
      }
      if (count === 0) {
        expect(render(<OfferType />).queryByText("Type d'offre")).toBeTruthy()
        expect(render(<OfferType />).queryByText("Type d'offre\xa0(")).toBeFalsy()
      } else {
        expect(render(<OfferType />).queryByText(`Type d'offre\xa0(${count})`)).toBeTruthy()
      }
    }
  )
})
