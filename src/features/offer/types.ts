import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'

export interface OfferTileProps {
  categoryId: CategoryIdEnum | null | undefined
  categoryLabel: string | null
  subcategoryId: SubcategoryIdEnum
  distance?: string
  date?: string
  name?: string
  isDuo?: boolean
  offerId: number
  venueId?: number
  price: string
  thumbUrl?: string
  isBeneficiary?: boolean
  analyticsFrom: Referrals
  moduleName?: string
  moduleId?: string
  homeEntryId?: string
  width: number
  height: number
  fromOfferId?: number
}
