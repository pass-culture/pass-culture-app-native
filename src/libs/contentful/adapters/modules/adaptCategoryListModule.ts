import { CategoryBlock, CategoryListModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import {
  CategoryBlockContentModel,
  CategoryListContentModel,
  ProvidedCategoryBlockContentModel,
} from 'libs/contentful/types'

export const adaptCategoryListModule = (
  module: CategoryListContentModel
): CategoryListModule | null => {
  if (module.fields === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.CategoryListModule,
    title: module.fields.title,
    categoryBlockList: adaptCategoryBlock(module.fields.categoryBlockList),
  }
}

const categoryBlockListHaveFields = (
  categoryBlock: CategoryBlockContentModel
): categoryBlock is ProvidedCategoryBlockContentModel =>
  !!categoryBlock?.fields && !!categoryBlock.fields.thematicCategoryInfo.fields

const adaptCategoryBlock = (CategoryBlockList: CategoryBlockContentModel[]): CategoryBlock[] =>
  CategoryBlockList.filter(categoryBlockListHaveFields).map((bloc) => {
    const { displayedTitle: title, image, color } = bloc.fields.thematicCategoryInfo.fields
    return {
      id: bloc.sys.id,
      image: buildImageUrl(image.fields?.file.url),
      homeEntryId: bloc.fields.homeEntryId,
      title,
      color,
    }
  })
