import React, { FunctionComponent } from 'react'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { Subcategory } from 'libs/subcategories/types'
type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}
export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  return (
    <React.Fragment>
      <Typo.Body>À propos</Typo.Body>
    </React.Fragment>
  )
}
