import { Hit } from 'algoliasearch/lite'

import { Offer } from 'shared/offer/types'

export const extractOfferIdsFromHits = (hits: Hit<Offer>[] = []) =>
  hits.map(({ objectID }) => Number(objectID))
