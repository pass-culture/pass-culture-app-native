import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OnlineOfflinePlatformChoicesEnum,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { Subcategory } from 'libs/subcategories/types'

export const mockSubcategory: Subcategory = {
  id: SubcategoryIdEnumv2.CINE_PLEIN_AIR,
  categoryId: CategoryIdEnum.CINEMA,
  appLabel: 'Cinéma plein air',
  searchGroupName: SearchGroupNameEnumv2.CINEMA,
  homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
  isEvent: true,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
}
export const mockSubcategoryNotEvent: Subcategory = {
  id: SubcategoryIdEnumv2.SEANCE_ESSAI_PRATIQUE_ART,
  categoryId: CategoryIdEnum.BEAUX_ARTS,
  appLabel: 'Beaux Arts',
  searchGroupName: SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
  homepageLabelName: HomepageLabelNameEnumv2.BEAUX_ARTS,
  isEvent: false,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.PRATIQUES_ET_ATELIERS_ARTISTIQUES,
}
export const mockSubcategoryBook: Subcategory = {
  id: SubcategoryIdEnumv2.LIVRE_PAPIER,
  categoryId: CategoryIdEnum.LIVRE,
  appLabel: 'Livre',
  searchGroupName: SearchGroupNameEnumv2.LIVRES,
  homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
  isEvent: false,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_PAPIER,
}
export const mockSubcategoryCD: Subcategory = {
  id: SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_MUSIQUE_CD,
  categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
  appLabel: 'CD',
  searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
  homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
  isEvent: false,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.CD,
}
