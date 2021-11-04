import mockdate from 'mockdate'
import React from 'react'

import { OfferBody } from 'features/offer/pages/OfferBody'
import { analytics } from 'libs/analytics'
import { cleanup, fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/home/api')
jest.mock('features/home/services/useAvailableCredit')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/pages/useTrackOfferSeenDuration')
jest.mock('libs/address/useFormatFullAddress')

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })
  afterEach(cleanup)

  const onScroll = jest.fn()

  const offerId = 1

  it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
    const OfferBodyComponent = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const reportOfferButton = await OfferBodyComponent.findByTestId('report-offer-body')

    fireEvent.press(reportOfferButton)
    expect(OfferBodyComponent).toMatchSnapshot()
  })

  it('should log analytics event ConsultVenue when pressing on the venue banner', async () => {
    const OfferBodyComponent = render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const venueBannerComponent = await OfferBodyComponent.findByTestId('VenueBannerComponent')

    fireEvent.press(venueBannerComponent)
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, { venueId: 2090, from: 'offer' })
  })
})
