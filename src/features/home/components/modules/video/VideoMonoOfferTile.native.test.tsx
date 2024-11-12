import { omit } from 'lodash'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

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

const user = userEvent.setup()

jest.useFakeTimers()

describe('VideoMonoOfferTile', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should redirect to an offer when pressing it', async () => {
    renderOfferVideoModule()

    await user.press(screen.getByText('La nuit des temps'))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 102_280 })
  })

  it('should display a placeholder if the offer has no image', async () => {
    const offerWithoutImage = omit(mockOffer, 'offer.thumbUrl')
    renderOfferVideoModule(offerWithoutImage)

    await act(async () => {})

    expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
  })

  it('should log ConsultOffer on when pressing it', async () => {
    renderOfferVideoModule()

    await user.press(screen.getByText('La nuit des temps'))

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: +mockOffer.objectID,
      ...mockAnalyticsParams,
    })
  })

  describe('With FF on', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should render properly', async () => {
      renderOfferVideoModule()

      expect(await screen.findByText('La nuit des temps')).toBeOnTheScreen()
    })
  })
})

function renderOfferVideoModule(offer?: Offer) {
  render(
    <VideoMonoOfferTile
      offer={offer ?? mockOffer}
      color=""
      hideModal={hideModalMock}
      analyticsParams={mockAnalyticsParams}
    />,
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
