import React from 'react'

import { Referrals } from 'features/navigation/navigators/RootNavigator/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('queries/subcategories/useSubcategoriesQuery')

const BOOK_HIT = mockedAlgoliaResponse.hits[0]

const props = {
  analyticsFrom: 'home' as Referrals,
  moduleName: 'Module Name',
  width: 100,
  height: 100,
}

const user = userEvent.setup()

jest.useFakeTimers()

describe('OfferTileWrapper component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should log ConsultOffer with the club advice type when the offer has club advices', async () => {
    const item = { ...BOOK_HIT, offer: { ...BOOK_HIT.offer, chroniclesCount: 5 } }
    render(reactQueryProviderHOC(<OfferTileWrapper item={item} {...props} />))

    await user.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith(
      expect.objectContaining({ adviceType: 'book_club' })
    )
  })

  it('should log ConsultOffer without advice type when the offer has no club advices', async () => {
    render(reactQueryProviderHOC(<OfferTileWrapper item={BOOK_HIT} {...props} />))

    await user.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith(
      expect.objectContaining({ adviceType: undefined })
    )
  })
})
