import { Activity } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { useGetGTLPlaylistsConfigByLabelQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistConfigByLabelQuery'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockedReturnedConfigPlaylist = [
  {
    displayParameters: { layout: 'two-items', minOffers: 5, title: 'Jeunesse' },
    id: '7FqRezKdV0mcUjOYerCUuJ',
    offersModuleParameters: {
      bookTypes: undefined,
      categories: ['Livres'],
      gtlLabel: 'Jeunesse',
      gtlLevel: 1,
      hitsPerPage: 35,
      isGeolocated: false,
      minBookingsThreshold: 5,
      movieGenres: undefined,
      musicTypes: undefined,
      showTypes: undefined,
      subcategories: undefined,
      title: 'Jeunesse',
    },
  },
  {
    displayParameters: { layout: 'two-items', minOffers: 1, title: 'Littérature' },
    id: '2xUlLBRfxdk6jeYyJszunX',
    offersModuleParameters: {
      bookTypes: undefined,
      categories: ['Livres'],
      gtlLabel: 'Littérature',
      gtlLevel: 1,
      hitsPerPage: 35,
      isGeolocated: false,
      movieGenres: undefined,
      musicTypes: undefined,
      showTypes: undefined,
      subcategories: undefined,
      title: 'Littérature',
    },
  },
]

describe('useGetGTLPlaylistsConfigByLabelQuery', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulGtlPlaylistSnap)
  })

  it('should fetch gtl playlist config when a searchGroupLabel is provided', async () => {
    const { result } = renderUseGetGTLPlaylistsConfigByLabelQuery(
      'Livres',
      Activity.PERFORMANCE_HALL
    )

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data).toEqual(mockedReturnedConfigPlaylist)
  })

  it.each`
    activity                       | expectedResult
    ${Activity.BOOKSTORE}          | ${mockedReturnedConfigPlaylist}
    ${Activity.RECORD_STORE}       | ${[]}
    ${Activity.DISTRIBUTION_STORE} | ${mockedReturnedConfigPlaylist}
  `(
    `should fetch gtl playlist config when activity is $activity`,
    async ({ activity, expectedResult }) => {
      const { result } = renderUseGetGTLPlaylistsConfigByLabelQuery(undefined, activity)

      await waitFor(async () => expect(result.current.isFetched).toEqual(true))

      expect(result.current.data).toEqual(expectedResult)
    }
  )

  it('should not fetch gtl playlist config for the wrong activity and no searchGroupLabel', async () => {
    const { result } = renderUseGetGTLPlaylistsConfigByLabelQuery(
      undefined,
      Activity.PERFORMANCE_HALL
    )

    await act(async () => {})

    expect(result.current.data).toEqual(undefined)
  })
})

const renderUseGetGTLPlaylistsConfigByLabelQuery = (
  searchGroupLabel?: ContentfulLabelCategories,
  activity?: Activity | null
) =>
  renderHook(() => useGetGTLPlaylistsConfigByLabelQuery(searchGroupLabel, activity), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
