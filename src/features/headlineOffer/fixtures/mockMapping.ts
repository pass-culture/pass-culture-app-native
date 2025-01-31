import { CategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'

export const mockMapping = {
  LIVRE_PAPIER: CategoryIdEnum.LIVRE,
  SEANCE_CINE: CategoryIdEnum.CINEMA,
} as CategoryIdMapping

export const mockLabelMapping = {
  [SubcategoryIdEnumv2.SEANCE_CINE]: 'Séance de cinéma',
  [SubcategoryIdEnumv2.LIVRE_PAPIER]: 'Livre papier',
} as CategoryHomeLabelMapping
