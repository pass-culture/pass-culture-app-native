import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { dehumanizeId } from 'features/offer/services/dehumanizeId'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { Hit } from '../Hit'

const hit = mockedAlgoliaResponse.hits[0]
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const offerId = dehumanizeId(hit.offer.id)!

describe('Hit component', () => {
  it('should navigate to the offer when clicking on the hit', async () => {
    const { getByTestId } = render(reactQueryProviderHOC(<Hit hit={hit} />))
    fireEvent.press(getByTestId('offerHit'))
    expect(navigate).toHaveBeenCalledWith('Offer', { id: offerId })
  })
})
