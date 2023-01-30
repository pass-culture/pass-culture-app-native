import {
  CategoryIdEnum,
  GenreType,
  GenreTypeContentModel,
  HomepageLabelNameEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
  SubcategoryResponseModelv2,
} from 'api/gen'

export type Subcategory = Omit<SubcategoryResponseModelv2, 'id'>
export type SubcategoriesMapping = Record<SubcategoryIdEnumv2, Subcategory>
export type CategoryIdMapping = Record<SubcategoryIdEnumv2, CategoryIdEnum>
export type HomeLabelMapping = Record<HomepageLabelNameEnumv2, string | null>
export type CategoryHomeLabelMapping = Record<SubcategoryIdEnumv2, string | null>
export type SearchGroupLabelMapping = Record<SearchGroupNameEnumv2, string>
export type SubcategoryLabelMapping = Record<string, SubcategoryIdEnumv2>
export type GenreTypeMapping = Record<GenreType, Array<GenreTypeContentModel>>
