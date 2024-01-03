import React, { FunctionComponent } from 'react'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { OfferArtists } from 'features/offerv2/components/OfferArtists/OfferArtists'
import { OfferPrice } from 'features/offerv2/components/OfferPrice/OfferPrice'
import { OfferTitle } from 'features/offerv2/components/OfferTitle/OfferTitle'
import { getOfferArtists } from 'features/offerv2/helpers/getOfferArtists/getOfferArtists'
import { getOfferTags } from 'features/offerv2/helpers/getOfferTags/getOfferTags'
import { Subcategory } from 'libs/subcategories/types'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}

export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  const tags = getOfferTags(subcategory.appLabel, offer.extraData ?? undefined)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)

  return (
    <React.Fragment>
      <InformationTags tags={tags} />

      <OfferTitle offerName={offer.name} />
      <Spacer.Column numberOfSpaces={2} />

      <OfferArtists artists={artists} />
      <Spacer.Column numberOfSpaces={6} />

      <OfferPrice prices={prices} />
      <Spacer.Column numberOfSpaces={6} />

      <Typo.Body>À propos</Typo.Body>
    </React.Fragment>
  )
}
