import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { bookTreeResultFixture } from 'features/search/helpers/categoriesHelpers/mappingFixture'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'

const mockedSubcateroriesV2Response = PLACEHOLDER_DATA
const mockedUndefinedFacets = undefined

jest.mock('libs/firebase/analytics/analytics')

describe('MappingTree', () => {
  it('should return a mapping tree for book category ROMANS_ET_LITTERATURE', () => {
    const result = createMappingTree(mockedSubcateroriesV2Response, mockedUndefinedFacets)

    expect(result.LIVRES.children?.ROMANS_ET_LITTERATURE).toEqual(
      expect.objectContaining(bookTreeResultFixture.SearchGroup.children.ROMANS_ET_LITTERATURE)
    )
  })

  it('should not return escape games category', () => {
    const result = createMappingTree(mockedSubcateroriesV2Response, mockedUndefinedFacets)

    expect(result.JEUX_JEUX_VIDEOS.children?.ESCAPE_GAMES).toBeUndefined()
  })
})
