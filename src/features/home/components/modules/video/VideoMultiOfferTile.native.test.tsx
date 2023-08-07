import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VideoMultiOfferTile } from 'features/home/components/modules/video/VideoMultiOfferTile'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockOffer = mockedAlgoliaResponse.hits[0]

const mockAnalyticsParams: OfferAnalyticsParams = {
  from: 'home',
  moduleId: 'abcd',
  moduleName: 'salut à tous c’est lujipeka',
  homeEntryId: 'xyz',
}

const hideModalMock = jest.fn()

describe('VideoMultiOfferTile', () => {
  it('should redirect to an offer when pressing it', async () => {
    renderMultiOfferTile()

    fireEvent.press(screen.getByText('La nuit des temps'))
    await act(async () => {})

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 102_280 })
  })

  it('should log ConsultOffer on when pressing it', async () => {
    renderMultiOfferTile()

    fireEvent.press(screen.getByText('La nuit des temps'))
    await act(async () => {})

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: +mockOffer.objectID,
      ...mockAnalyticsParams,
    })
  })
})

function renderMultiOfferTile() {
  render(
    <VideoMultiOfferTile
      offer={mockOffer}
      hideModal={hideModalMock}
      analyticsParams={mockAnalyticsParams}
    />,
    {
      /* eslint-disable local-rules/no-react-query-provider-hoc */
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
