import { formattedCategoryListModule } from 'features/home/fixtures/homepage.fixture'
import { adaptCategoryListModule } from 'libs/contentful/adapters/modules/adaptCategoryListModule'
import { categoryListFixture } from 'libs/contentful/fixtures/categoryList.fixture'
import { isCategoryListContentModel } from 'libs/contentful/types'

describe('adaptCategoryListModule', () => {
  it('should adapt a CategoryList module', () => {
    const rawCategoryListModule = categoryListFixture

    expect(isCategoryListContentModel(rawCategoryListModule)).toBe(true)
    expect(adaptCategoryListModule(rawCategoryListModule)).toEqual(formattedCategoryListModule)
  })

  it('should adapt category block title parts when they are defined', () => {
    const categoryListFields = categoryListFixture.fields
    const categoryBlock = categoryListFields?.categoryBlockList[0]
    const thematicCategoryInfo = categoryBlock?.fields?.thematicCategoryInfo

    if (!categoryListFields || !categoryBlock?.fields || !thematicCategoryInfo?.fields)
      throw new Error('Missing category list fixture fields')

    const rawCategoryListModule = {
      ...categoryListFixture,
      fields: {
        ...categoryListFields,
        categoryBlockList: [
          {
            ...categoryBlock,
            fields: {
              ...categoryBlock.fields,
              thematicCategoryInfo: {
                ...thematicCategoryInfo,
                fields: {
                  ...thematicCategoryInfo.fields,
                  titleParts: ['vos', 'livres'],
                },
              },
            },
          },
        ],
      },
    }

    expect(adaptCategoryListModule(rawCategoryListModule)?.categoryBlockList[0]).toEqual(
      expect.objectContaining({
        title: 'Livres',
        titleParts: ['vos', 'livres'],
      })
    )
  })
})
