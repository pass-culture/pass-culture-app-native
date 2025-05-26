import { VenueTypeCodeKey } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { useGetGTLPlaylistsConfigByLabelQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistConfigByLabelQuery'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

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
      VenueTypeCodeKey.CONCERT_HALL
    )

    await act(async () => {})

    expect(result.current.data).toEqual(mockedReturnedConfigPlaylist)
  })

  it.each`
    venueType                              | expectedResult
    ${VenueTypeCodeKey.BOOKSTORE}          | ${mockedReturnedConfigPlaylist}
    ${VenueTypeCodeKey.RECORD_STORE}       | ${[]}
    ${VenueTypeCodeKey.DISTRIBUTION_STORE} | ${mockedReturnedConfigPlaylist}
  `(
    `should fetch gtl playlist config when venueType is $venueType`,
    async ({ venueType, expectedResult }) => {
      const { result } = renderUseGetGTLPlaylistsConfigByLabelQuery(undefined, venueType)

      await act(async () => {})

      expect(result.current.data).toEqual(expectedResult)
    }
  )

  it('should not fetch gtl playlist config for the wrong venueType and no searchGroupLabel', async () => {
    const { result } = renderUseGetGTLPlaylistsConfigByLabelQuery(
      undefined,
      VenueTypeCodeKey.CONCERT_HALL
    )

    await act(async () => {})

    expect(result.current.data).toEqual(undefined)
  })
})

const renderUseGetGTLPlaylistsConfigByLabelQuery = (
  searchGroupLabel?: ContentfulLabelCategories,
  venueTypeCode?: VenueTypeCodeKey | null
) =>
  renderHook(() => useGetGTLPlaylistsConfigByLabelQuery(searchGroupLabel, venueTypeCode), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
