import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnum } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { OfferTile } from '../OfferTile'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656

const props = {
  analyticsFrom: 'home' as Referrals,
  categoryLabel: HomepageLabelNameEnum.MUSIQUE,
  categoryId: CategoryIdEnum.MUSIQUE_LIVE,
  subcategoryId: offer.subcategoryId,
  expenseDomains: [],
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
  moduleName: 'Module Name',
  width: 100,
  height: 100,
}

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<OfferTile {...props} />))
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.click(getByTestId(`offre ${offer.name}`))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'home',
      moduleName: 'Module Name',
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.click(getByTestId(`offre ${offer.name}`))
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'home',
      moduleName: props.moduleName,
    })
  })

  it('Analytics - should log ConsultOffer with homeEntryID if provided', async () => {
    const { getByTestId } = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<OfferTile {...props} homeEntryId={'abcd'} />)
    )
    await fireEvent.click(getByTestId(`offre ${offer.name}`))
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'home',
      moduleName: props.moduleName,
      homeEntryId: 'abcd',
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.click(getByTestId(`offre ${offer.name}`))

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
      isEducational: false,
      isReleased: true,
      isForbiddenToUnderage: false,
      isExpired: false,
      isSoldOut: false,
      subcategoryId: offer.subcategoryId,
      name: offer.name,
      stocks: [],
      venue: { coordinates: {} },
    })
  })
})
