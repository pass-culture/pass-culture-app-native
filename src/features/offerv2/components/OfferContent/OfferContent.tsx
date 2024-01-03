import React, { FunctionComponent } from 'react'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { getOfferTags } from 'features/offerv2/helpers/getOfferTags/getOfferTags'
import { Subcategory } from 'libs/subcategories/types'
import { InformationTags } from 'ui/InformationTags/InformationTags'
type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}
export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  const tags = getOfferTags(subcategory.appLabel, offer.extraData ?? undefined)
  return (
    <React.Fragment>
      <InformationTags tags={tags} />
      <Typo.Body>À propos</Typo.Body>
    </React.Fragment>
  )
}
