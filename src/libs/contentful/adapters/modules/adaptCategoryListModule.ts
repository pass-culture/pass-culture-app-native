import { CategoryListModule, HomepageModuleType } from 'features/home/types'
import { buildImageUrl } from 'libs/contentful/adapters/helpers/buildImageUrl'
import { CategoryListContentModel } from 'libs/contentful/types'

export const adaptCategoryListModule = (module: CategoryListContentModel): CategoryListModule => {
  return {
    id: module.sys.id,
    type: HomepageModuleType.CategoryListModule,
    title: module.fields.title,
    categoryBlockList: module.fields.categoryBlockList
      .filter((categoryBlock) => categoryBlock.fields)
      .map(({ fields }) => {
        const image = fields.image ? buildImageUrl(fields.image.fields.file.url) : undefined
        return { ...fields, image }
      }),
  }
}
