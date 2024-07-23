import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoMultiOfferTile } from 'features/home/components/modules/video/VideoMultiOfferTile'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

const mockOffer = mockedAlgoliaResponse.hits[0]
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockAnalyticsParams: OfferAnalyticsParams = {
  from: 'home',
  moduleId: 'abcd',
  moduleName: 'salut à tous c’est lujipeka',
  homeEntryId: 'xyz',
}

const hideModalMock = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

describe('VideoMultiOfferTile', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

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

  it('should render properly with FF on', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    renderMultiOfferTile()

    await screen.findByText('La nuit des temps')

    expect(screen).toMatchSnapshot()
  })
})

function renderMultiOfferTile(homeEntryId = 'test') {
  render(
    <VideoMultiOfferTile
      offer={mockOffer}
      hideModal={hideModalMock}
      analyticsParams={mockAnalyticsParams}
      homeEntryId={homeEntryId}
    />,
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
