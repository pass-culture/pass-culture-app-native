import { omit } from 'lodash'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { Color } from 'features/home/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

const mockOffer = mockedAlgoliaResponse.hits[0]

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
    setFeatureFlags()
  })

  it('should render properly', async () => {
    renderOfferVideoModule()

    expect(await screen.findByText(mockOffer.offer.name)).toBeOnTheScreen()
  })

  it('should redirect to an offer when pressing it', async () => {
    renderOfferVideoModule()

    await user.press(screen.getByText(mockOffer.offer.name))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: 102_280 })
  })

  it('should display a placeholder if the offer has no image', async () => {
    const offerWithoutImage = omit(mockOffer, 'offer.thumbUrl')
    renderOfferVideoModule(offerWithoutImage)

    await screen.findByText(mockOffer.offer.name)

    expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
  })

  it('should log ConsultOffer on when pressing it', async () => {
    renderOfferVideoModule()

    await user.press(screen.getByText(mockOffer.offer.name))

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: +mockOffer.objectID,
      ...mockAnalyticsParams,
    })
  })
})

function renderOfferVideoModule(offer?: Offer) {
  render(
    <VideoMonoOfferTile
      offer={offer ?? mockOffer}
      color={Color.Aquamarine}
      hideModal={hideModalMock}
      analyticsParams={mockAnalyticsParams}
    />,
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
