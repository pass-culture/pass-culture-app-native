import React from 'react'

import { initialSearchState } from 'features/search/context/reducer/reducer'
import { OfferType as OfferTypeEnum } from 'features/search/enums'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { OfferType } from './OfferType'

const mockSearchState = jest.fn().mockReturnValue({
  searchState: initialSearchState,
})

jest.mock('features/search/context/SearchWrapper/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

describe('OfferType component', () => {
  it('should have no description when no selection', () => {
    const { queryByText } = renderOfferType()
    expect(queryByText("Type d'offre")).toBeTruthy()
    expect(queryByText(OfferTypeEnum.EVENT)).toBeFalsy()
    expect(queryByText(`${OfferTypeEnum.EVENT} DUO`)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.THING)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.DIGITAL)).toBeFalsy()
  })

  it('should have offerType event description when offerType is event', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: false,
        offerTypes: {
          isThing: false,
          isEvent: true,
          isDigital: false,
        },
      },
    })
    const { queryByText } = renderOfferType()
    expect(queryByText(OfferTypeEnum.EVENT)).toBeTruthy()
    expect(queryByText(`${OfferTypeEnum.EVENT} DUO`)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.THING)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.DIGITAL)).toBeFalsy()
  })

  it('should have offerType event with duo description when offerType is event and offerIsDuo is true', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: true,
        offerTypes: {
          isThing: false,
          isEvent: true,
          isDigital: false,
        },
      },
    })
    const { queryByText } = renderOfferType()
    expect(queryByText(OfferTypeEnum.EVENT)).toBeFalsy()
    expect(queryByText(`${OfferTypeEnum.EVENT} DUO`)).toBeTruthy()
    expect(queryByText(OfferTypeEnum.THING)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.DIGITAL)).toBeFalsy()
  })

  it('should have offerType event description when offerType is thing', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: false,
        offerTypes: {
          isThing: true,
          isEvent: false,
          isDigital: false,
        },
      },
    })
    const { queryByText } = renderOfferType()
    expect(queryByText(OfferTypeEnum.EVENT)).toBeFalsy()
    expect(queryByText(`${OfferTypeEnum.EVENT} DUO`)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.THING)).toBeTruthy()
    expect(queryByText(OfferTypeEnum.DIGITAL)).toBeFalsy()
  })

  it('should have offerType event description when offerType is digital', () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        offerIsDuo: false,
        offerTypes: {
          isThing: false,
          isEvent: false,
          isDigital: true,
        },
      },
    })
    const { queryByText } = renderOfferType()
    expect(queryByText(OfferTypeEnum.EVENT)).toBeFalsy()
    expect(queryByText(`${OfferTypeEnum.EVENT} DUO`)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.THING)).toBeFalsy()
    expect(queryByText(OfferTypeEnum.DIGITAL)).toBeTruthy()
  })
})

function renderOfferType() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<OfferType />))
}
