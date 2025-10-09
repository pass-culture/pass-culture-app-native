import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OnlineOfflinePlatformChoicesEnum,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
  SubcategoryResponseModelv2,
} from 'api/gen'
import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  SubcategoriesMapping,
} from 'libs/subcategories/types'

export const mockMapping = {
  LIVRE_PAPIER: CategoryIdEnum.LIVRE,
  SEANCE_CINE: CategoryIdEnum.CINEMA,
} as CategoryIdMapping

export const mockLabelMapping = {
  [SubcategoryIdEnumv2.SEANCE_CINE]: 'Séance de cinéma',
  [SubcategoryIdEnumv2.LIVRE_PAPIER]: 'Livre papier',
} as CategoryHomeLabelMapping

const mockedConcertSubcategoryResponseModelv2: SubcategoryResponseModelv2 = {
  isEvent: true,
  appLabel: '',
  categoryId: CategoryIdEnum.MUSIQUE_LIVE,
  homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
  id: SubcategoryIdEnumv2.CONCERT,
  nativeCategoryId: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  searchGroupName: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
}

const mockedCinemaSubcategoryResponseModelv2: SubcategoryResponseModelv2 = {
  isEvent: true,
  appLabel: '',
  categoryId: CategoryIdEnum.CINEMA,
  homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
  id: SubcategoryIdEnumv2.SEANCE_CINE,
  nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  searchGroupName: SearchGroupNameEnumv2.CINEMA,
}

const mockedBookSubcategoryResponseModelv2: SubcategoryResponseModelv2 = {
  isEvent: false,
  appLabel: '',
  categoryId: CategoryIdEnum.LIVRE,
  homepageLabelName: HomepageLabelNameEnumv2.LIVRES,
  id: SubcategoryIdEnumv2.LIVRE_PAPIER,
  nativeCategoryId: NativeCategoryIdEnumv2.LIVRES_PAPIER,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnum.OFFLINE,
  searchGroupName: SearchGroupNameEnumv2.LIVRES,
}

export const mockSubcategoriesMapping = {
  CONCERT: mockedConcertSubcategoryResponseModelv2,
  SEANCE_CINE: mockedCinemaSubcategoryResponseModelv2,
  LIVRE_PAPIER: mockedBookSubcategoryResponseModelv2,
} as SubcategoriesMapping
