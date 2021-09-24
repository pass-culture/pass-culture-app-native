import { SubcategoryIdEnum, SubcategoryResponseModel } from 'api/gen'

export type Subcategory = Omit<SubcategoryResponseModel, 'id'>
export type SubcategoriesMapping = Record<SubcategoryIdEnum, Subcategory>
