import mockdate from 'mockdate'
import React from 'react'
import { QueryClient } from 'react-query'

import { OfferBody } from 'features/offer/pages/OfferBody'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { cleanup, fireEvent, render } from 'tests/utils'

jest.mock('features/home/api')
jest.mock('features/home/services/useAvailableCredit')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/pages/useTrackOfferSeenDuration')

const venueId = '1234'
const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData(['venue', venueId], venueResponseSnap)
}

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })
  afterEach(cleanup)

  const onScroll = jest.fn()

  const offerId = 1

  beforeEach(jest.clearAllMocks)

  it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
    const OfferBodyComponent = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<OfferBody offerId={offerId} onScroll={onScroll} />, setup)
    )

    const reportOfferButton = await OfferBodyComponent.findByTestId('report-offer-body')

    fireEvent.press(reportOfferButton)
    expect(OfferBodyComponent).toMatchSnapshot()
  })

  it('should log analytics event ConsultVenue when pressing on the venue banner', async () => {
    const OfferBodyComponent = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<OfferBody offerId={offerId} onScroll={onScroll} />, setup)
    )
    const venueBannerComponent = await OfferBodyComponent.findByTestId('VenueBannerComponent')

    fireEvent.press(venueBannerComponent)
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, { venueId: 2090, from: 'offer' })
  })
})
