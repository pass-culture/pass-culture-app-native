import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { getSimilarOrRecoOffersInOrder } from 'shared/offer/getSimilarOrRecoOffersInOrder'

describe('getSimilarOffersInOrder', () => {
  const ids = ['102310', '102249', '102272', '102280']
  const offers = mockedAlgoliaResponse.hits

  const getOfferById = (id: string) => offers.find((offer) => offer.objectID === id)

  it('should return offers in ids array order', () => {
    const similarOffersInOrder = getSimilarOrRecoOffersInOrder(ids, offers)

    expect(similarOffersInOrder).toEqual(ids.map((id) => getOfferById(id)))
  })

  it('should not return offers in offers array order', () => {
    const similarOffersInOrder = getSimilarOrRecoOffersInOrder(ids, offers)

    expect(similarOffersInOrder).not.toEqual(offers)
  })
})
