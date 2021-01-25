import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Hit } from '../Hit'

const hit = mockedAlgoliaResponse.hits[0]
const offerId = dehumanizeId(hit.offer.id)

let mockDistance: string | null = null
jest.mock('features/offer/components/useDistance', () => ({
  useDistance: () => mockDistance,
}))

describe('Hit component', () => {
  it('should navigate to the offer when clicking on the hit', () => {
    const { getByTestId } = render(reactQueryProviderHOC(<Hit hit={hit} />))
    fireEvent.press(getByTestId('offerHit'))
    expect(navigate).toHaveBeenCalledWith('Offer', { id: offerId })
  })
  it('should show distance if geolocation enabled', async () => {
    mockDistance = '10 km'
    const { queryByText } = render(reactQueryProviderHOC(<Hit hit={hit} />))
    expect(queryByText('10 km')).toBeTruthy()
  })
  it('offer name should take full space if no geolocation', async () => {
    mockDistance = '10 km'
    const withDistanceSnapshot = render(reactQueryProviderHOC(<Hit hit={hit} />)).toJSON()

    mockDistance = null
    const withoutDistanceSnapshot = render(reactQueryProviderHOC(<Hit hit={hit} />)).toJSON()
    expect(withoutDistanceSnapshot).toMatchDiffSnapshot(withDistanceSnapshot)
  })
})
