import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import {
  bookTreeResultFixture,
  treeResultFixture,
} from 'features/search/helpers/categoriesHelpers/mappingFixture'
import { FacetData } from 'libs/algolia'
import { mockedFacets } from 'libs/algolia/__mocks__/mockedFacets'
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
        mockedFacets.facets as FacetData,
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
    const bookResult = result['LIVRES'].children
      ? result['LIVRES'].children['ROMANS_ET_LITTERATURE']
      : undefined

    expect(bookResult).toEqual(bookTreeResultFixture.SearchGroup.children.ROMANS_ET_LITTERATURE)
  })
})
