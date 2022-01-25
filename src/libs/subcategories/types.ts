import {
  CategoryIdEnum,
  HomepageLabelNameEnum,
  SearchGroupNameEnum,
  SubcategoryIdEnum,
  SubcategoryResponseModel,
} from 'api/gen'

export type Subcategory = Omit<SubcategoryResponseModel, 'id'>
export type SubcategoriesMapping = Record<SubcategoryIdEnum, Subcategory>
export type CategoryIdMapping = Record<SubcategoryIdEnum, CategoryIdEnum>
export type HomeLabelMapping = Record<HomepageLabelNameEnum, string | null>
export type CategoryHomeLabelMapping = Record<SubcategoryIdEnum, string | null>
export type SearchGroupLabelMapping = Record<SearchGroupNameEnum, string>
export type SubcategoryLabelMapping = Record<string, SubcategoryIdEnum>
