import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnumv2 } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { OfferTile } from './OfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656

const props = {
  analyticsFrom: 'home' as Referrals,
  categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
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
  handlePressOffer: jest.fn(),
}

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(push).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'home',
      moduleName: 'Module Name',
    })
  })
})
