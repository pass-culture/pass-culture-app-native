import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import {
  bookTreeResultFixture,
  treeResultFixture,
} from 'features/search/helpers/categoriesHelpers/mappingFixture'
import { algoliaFacets } from 'libs/algolia/fixtures/algoliaFacets'
import { FacetData } from 'libs/algolia/types'
import { placeholderData } from 'libs/subcategories/placeholderData'

const mockedSubcateroriesV2Response = placeholderData
const mockedUndefinedFacets = undefined
const mockedNewMappingEnabled = true

describe('MappingTree', () => {
  it('createMappingTree should return correct tree', () => {
    const expectedResult = treeResultFixture

    expect(
      createMappingTree(
        mockedSubcateroriesV2Response,
        algoliaFacets.facets as FacetData,
        !mockedNewMappingEnabled
      )
    ).toEqual(expectedResult)
  })

  it('should return a mapping tree for book category ROMANS_ET_LITTERATURE with FF newMappingEnabled to true', () => {
    const result = createMappingTree(
      mockedSubcateroriesV2Response,
      mockedUndefinedFacets,
      mockedNewMappingEnabled
    )

    expect(result['LIVRES'].children).toEqual(
      expect.objectContaining({
        ROMANS_ET_LITTERATURE: bookTreeResultFixture.SearchGroup.children.ROMANS_ET_LITTERATURE,
      })
    )
  })
})
