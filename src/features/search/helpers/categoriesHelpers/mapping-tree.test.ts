import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { bookTreeResultFixture } from 'features/search/helpers/categoriesHelpers/mappingFixture'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'

const mockedSubcateroriesV2Response = PLACEHOLDER_DATA
const mockedUndefinedFacets = undefined

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('MappingTree', () => {
  it('should return a mapping tree for book category ROMANS_ET_LITTERATURE', () => {
    const result = createMappingTree(mockedSubcateroriesV2Response, mockedUndefinedFacets)

    expect(result.LIVRES.children).toEqual(
      expect.objectContaining({
        ROMANS_ET_LITTERATURE: bookTreeResultFixture.SearchGroup.children.ROMANS_ET_LITTERATURE,
      })
    )
  })
})
