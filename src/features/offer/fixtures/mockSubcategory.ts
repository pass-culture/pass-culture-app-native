import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
} from 'api/gen'
import { Subcategory } from 'libs/subcategories/types'

export const mockSubcategory: Subcategory = {
  categoryId: CategoryIdEnum.CINEMA,
  appLabel: 'Cinéma plein air',
  searchGroupName: SearchGroupNameEnumv2.CINEMA,
  homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
  isEvent: true,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
}
export const mockSubcategoryNotEvent: Subcategory = {
  categoryId: CategoryIdEnum.BEAUX_ARTS,
  appLabel: 'Beaux Arts',
  searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
  homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
  isEvent: false,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES,
}
export const mockSubcategoryBook: Subcategory = {
  categoryId: CategoryIdEnum.LIVRE,
  appLabel: 'Livre',
  searchGroupName: SearchGroupNameEnumv2.LIVRES,
  homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
  isEvent: false,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_PAPIER,
}
export const mockSubcategoryCD: Subcategory = {
  categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
  appLabel: 'CD',
  searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
  homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
  isEvent: false,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.CD,
}
