import { CategoryIdEnum, SubcategoryIdEnum, SubcategoryResponseModel } from 'api/gen'

export type Subcategory = Omit<SubcategoryResponseModel, 'id'>
export type SubcategoriesMapping = Record<SubcategoryIdEnum, Subcategory>
export type CategoryIdMapping = Record<SubcategoryIdEnum, CategoryIdEnum>
