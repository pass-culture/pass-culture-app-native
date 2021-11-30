import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { Hit } from '../Hit'

const mockSearchState = initialSearchState

const hit = mockedAlgoliaResponse.hits[0]
const offerId = +hit.objectID

let mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

describe('Hit component', () => {
  it('should navigate to the offer when clicking on the hit', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<Hit hit={hit} query="" />))
    fireEvent.press(getByTestId('offerHit'))
    expect(analytics.logConsultOffer).toBeCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'search',
      query: '',
    })
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'search',
    })
  })
  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { queryByText } = render(reactQueryProviderHOC(<Hit hit={hit} query="" />))
    expect(queryByText('10 km')).toBeTruthy()
  })
  it('offer name should take full space if no geolocation', () => {
    mockDistance = '10 km'
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const withDistance = render(reactQueryProviderHOC(<Hit hit={hit} query="" />)).toJSON()

    mockDistance = null
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const withoutDistance = render(reactQueryProviderHOC(<Hit hit={hit} query="" />)).toJSON()
    expect(withoutDistance).toMatchDiffSnapshot(withDistance)
  })
})
