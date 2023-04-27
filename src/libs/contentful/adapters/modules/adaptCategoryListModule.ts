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
    const { displayedTitle: title, image } = bloc.fields.thematicCategoryInfo.fields
    return {
      id: bloc.sys.id,
      image: image?.fields ? buildImageUrl(image.fields.file.url) : undefined,
      homeEntryId: bloc.fields.homeEntryId,
      title: title,
    }
  })
