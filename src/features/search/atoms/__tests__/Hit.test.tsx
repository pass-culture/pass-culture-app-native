import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { initialSearchState } from 'features/search/pages/reducer'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Hit } from '../Hit'

const mockSearchState = initialSearchState

const hit = mockedAlgoliaResponse.hits[0]
const offerId = dehumanizeId(hit.offer.id)

let mockDistance: string | null = null
jest.mock('features/offer/components/useDistance', () => ({
  useDistance: () => mockDistance,
}))

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

describe('Hit component', () => {
  it('should navigate to the offer when clicking on the hit', () => {
    const { getByTestId } = render(reactQueryProviderHOC(<Hit hit={hit} query="" />))
    fireEvent.press(getByTestId('offerHit'))
    expect(analytics.logConsultOffer).toBeCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'SEARCH',
      query: '',
    })
    expect(navigate).toHaveBeenCalledWith('Offer', { id: offerId, shouldDisplayLoginModal: false })
  })
  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    const { queryByText } = render(reactQueryProviderHOC(<Hit hit={hit} query="" />))
    expect(queryByText('10 km')).toBeTruthy()
  })
  it('offer name should take full space if no geolocation', () => {
    mockDistance = '10 km'
    const withDistance = render(reactQueryProviderHOC(<Hit hit={hit} query="" />)).toJSON()

    mockDistance = null
    const withoutDistance = render(reactQueryProviderHOC(<Hit hit={hit} query="" />)).toJSON()
    expect(withoutDistance).toMatchDiffSnapshot(withDistance)
  })
})
