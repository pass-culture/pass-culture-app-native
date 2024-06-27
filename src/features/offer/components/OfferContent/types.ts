import { OfferResponseV2, SearchGroupResponseModelv2 } from 'api/gen'
import { Subcategory } from 'libs/subcategories/types'

export type OfferContentProps = {
  offer: OfferResponseV2
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}
