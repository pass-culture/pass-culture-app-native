import {
  CategoryIdEnum,
  HomepageLabelNameEnum,
  SubcategoryIdEnum,
  SubcategoryResponseModel,
} from 'api/gen'

export type Subcategory = Omit<SubcategoryResponseModel, 'id'>
export type SubcategoriesMapping = Record<SubcategoryIdEnum, Subcategory>
export type CategoryIdMapping = Record<SubcategoryIdEnum, CategoryIdEnum>
export type HomeLabelMapping = Record<HomepageLabelNameEnum, string | null>
export type CategoryHomeLabelMapping = Record<SubcategoryIdEnum, string | null>
