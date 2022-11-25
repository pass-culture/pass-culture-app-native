import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { SearchHit } from 'libs/search'
import { cleanup, fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/profile/api')
jest.mock('features/home/services/useAvailableCredit')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/helpers/useTrackOfferSeenDuration')
jest.mock('libs/address/useFormatFullAddress')

let mockSearchHits: SearchHit[] = []
jest.mock('features/offer/api/useSimilarOffers', () => ({
  useSimilarOffers: jest.fn(() => mockSearchHits),
}))

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })
  afterEach(cleanup)

  const onScroll = jest.fn()

  const offerId = 1

  it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
    const OfferBodyComponent = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const reportOfferButton = await OfferBodyComponent.findByTestId('Signaler l’offre')

    fireEvent.press(reportOfferButton)
    expect(OfferBodyComponent).toMatchSnapshot()
  })

  it('should log analytics event ConsultVenue when pressing on the venue banner', async () => {
    const OfferBodyComponent = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const venueBannerComponent = await OfferBodyComponent.findByTestId('VenueBannerComponent')

    fireEvent.press(venueBannerComponent)
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, { venueId: 2090, from: 'offer' })
  })

  it('should not display similar offers list when offer has not it', async () => {
    const { queryByTestId } = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    expect(queryByTestId('offersModuleList')).toBeFalsy()
  })

  describe('with similar offers', () => {
    beforeAll(() => {
      mockSearchHits = mockedAlgoliaResponse.hits
    })

    it('should display similar offers list when offer has some', async () => {
      const { queryByTestId } = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      expect(queryByTestId('offersModuleList')).toBeTruthy()
    })

    it('should pass offer venue position to `useSimilarOffers`', () => {
      const spy = jest.spyOn(useSimilarOffers, 'useSimilarOffers').mockImplementationOnce(jest.fn())
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      expect(spy).toHaveBeenNthCalledWith(1, offerId, mockOffer.venue.coordinates)
    })

    it('should navigate to a similar offer when pressing on it', async () => {
      const { getByTestId } = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await fireEvent.press(getByTestId('offre La nuit des temps'))
      expect(navigate).toHaveBeenCalledWith('Offer', {
        from: 'offer',
        id: 102280,
      })
    })
  })
})
