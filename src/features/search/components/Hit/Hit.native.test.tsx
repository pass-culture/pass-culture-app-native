import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { Hit } from './Hit'

const hit = mockedAlgoliaResponse.hits[0]
const offerId = +hit.objectID

let mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const spyLogClickOnOffer = jest.fn()
const mockUseLogClickOnOffer = jest.spyOn(logClickOnProductAPI, 'useLogClickOnOffer')
mockUseLogClickOnOffer.mockReturnValue({ logClickOnOffer: spyLogClickOnOffer })

jest.mock('libs/algolia/analytics/SearchAnalyticsWrapper', () => ({
  useSearchAnalyticsState: () => ({ currentQueryID: 'abc123' }),
}))

describe('Hit component', () => {
  it('should navigate to the offer when clicking on the hit', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByRole } = render(reactQueryProviderHOC(<Hit hit={hit} query="" index={0} />))
    await fireEvent.press(getByRole('link'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'search',
    })
  })

  it('should log analytics event when clicking on the hit', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByRole } = render(reactQueryProviderHOC(<Hit hit={hit} query="" index={0} />))
    await fireEvent.press(getByRole('link'))
    expect(analytics.logConsultOffer).toBeCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'search',
      query: '',
    })
  })

  it('should notify Algolia when pressing on an hit', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByRole } = render(reactQueryProviderHOC(<Hit hit={hit} query="" index={0} />))

    const hitComponent = getByRole('link')
    await fireEvent.press(hitComponent)

    expect(spyLogClickOnOffer).toHaveBeenCalledWith({
      objectID: '102280',
      position: 0,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { queryByText } = render(reactQueryProviderHOC(<Hit hit={hit} query="" index={0} />))
    expect(queryByText('10 km')).toBeTruthy()
  })

  it('offer name should take full space if no geolocation', () => {
    mockDistance = '10 km'
    const withDistance = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<Hit hit={hit} query="" index={0} />)
    ).toJSON()

    mockDistance = null
    const withoutDistance = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<Hit hit={hit} query="" index={0} />)
    ).toJSON()
    expect(withoutDistance).toMatchDiffSnapshot(withDistance)
  })
})
