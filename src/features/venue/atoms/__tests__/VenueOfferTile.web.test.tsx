import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnum } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { VenueOfferTile } from '../VenueOfferTile'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656
const venueId = 34

const props = {
  categoryLabel: HomepageLabelNameEnum.MUSIQUE,
  categoryId: CategoryIdEnum.MUSIQUE_LIVE,
  subcategoryId: offer.subcategoryId,
  expenseDomains: [],
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
  venueId,
  width: 100,
  height: 100,
}

describe('VenueOfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    await fireEvent.click(getByTestId('categoryImageCaption'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'venue',
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('categoryImageCaption'))
    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId,
      from: 'venue',
      venueId,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueOfferTile {...props} />))
    fireEvent.click(getByTestId('categoryImageCaption'))

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)
    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      description: '',
      expenseDomains: [],
      id: offerId,
      image: { url: props.thumbUrl },
      isDigital: false,
      isDuo: false,
      isReleased: true,
      isEducational: false,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      name: offer.name,
      stocks: [],
      subcategoryId: offer.subcategoryId,
      venue: { coordinates: {} },
    })
  })
})
