import { adaptOffersWithPage } from 'libs/algolia/fetchAlgolia/fetchOffers/adaptOffersWithPage'
import { offersFixture } from 'libs/algolia/fetchAlgolia/fetchOffers/fixtures/offersFixture'
import { OffersWithPage } from 'shared/offer/types'

describe('adaptAlgoliaOffersWithPage', () => {
  it('should correctly format AlgoliaOffersWithPage', () => {
    const offers = offersFixture
    const NB_PAGES = 2
    const PAGES = 2
    const NB_OFFERS = offers.length
    const expectedOffersWithPage: OffersWithPage = {
      nbOffers: NB_OFFERS,
      nbPages: NB_OFFERS,
      page: NB_OFFERS,
      offers: offers,
      userData: ['data'],
    }

    const result = adaptOffersWithPage({
      offers,
      nbOffers: NB_OFFERS,
      nbPages: NB_PAGES,
      page: PAGES,
      userData: ['data'],
    })
    expect(result).toEqual(expectedOffersWithPage)
  })
})
