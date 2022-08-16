import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferBody } from 'features/offer/pages/OfferBody'
import { analytics } from 'libs/firebase/analytics'
import { act, cleanup, fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/profile/api')
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
  const offerId = offerResponseSnap.id

  it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
    const { findByTestId, queryByTestId } = render(
      <OfferBody offerId={offerId} onScroll={onScroll} />
    )
    const reportOfferButton = await findByTestId('report-offer-button')

    fireEvent.press(reportOfferButton)

    await act(async () => {
      await waitForExpect(() => expect(queryByTestId('report-offer-modal')).toBeTruthy())
    })
  })

  it('should log analytics event ConsultVenue when pressing on the venue banner', async () => {
    const OfferBodyComponent = render(<OfferBody offerId={offerId} onScroll={onScroll} />)
    const venueBannerComponent = await OfferBodyComponent.findByTestId('VenueBannerComponent')

    fireEvent.press(venueBannerComponent)

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: offerResponseSnap.venue.id,
      from: 'offer',
    })
  })
})
