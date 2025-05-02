import { VenueTypeCodeKey } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { useGetGTLPlaylistsConfigQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistsConfigQuery'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useGetGTLPlaylistConfigQuery', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulGtlPlaylistSnap)
  })

  it('should allow selecting a subset of data', async () => {
    const defaultId = '7FqRezKdV0mcUjOYerCUuJ'
    const { result } = renderUseGetGTLPlaylistConfigQuery(
      { searchGroupLabel: 'Livres', venueTypeCode: VenueTypeCodeKey.BOOKSTORE },
      (data) => data.find((r) => r.id === defaultId)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: { title: 'Jeunesse', layout: 'two-items', minOffers: 5 },
        offersModuleParameters: expect.objectContaining({
          title: 'Jeunesse',
          hitsPerPage: 35,
          gtlLevel: 1,
          gtlLabel: 'Jeunesse',
        }),
      })
    )
  })

  it.each`
    venuType
    ${VenueTypeCodeKey.BOOKSTORE}
    ${VenueTypeCodeKey.DISTRIBUTION_STORE}
    ${VenueTypeCodeKey.RECORD_STORE}
  `('should fetch gtl playlist config when venueType is $venue.venueTypeCode', async () => {
    const defaultId = '7FqRezKdV0mcUjOYerCUuJ'
    const { result } = renderUseGetGTLPlaylistConfigQuery(
      { searchGroupLabel: 'Livres', venueTypeCode: VenueTypeCodeKey.BOOKSTORE },
      (data) => data.find((r) => r.id === defaultId)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: { title: 'Jeunesse', layout: 'two-items', minOffers: 5 },
        offersModuleParameters: expect.objectContaining({
          title: 'Jeunesse',
          hitsPerPage: 35,
          gtlLevel: 1,
          gtlLabel: 'Jeunesse',
        }),
      })
    )
  })

  it('should not fetch gtl playlist config for the wrong venueType', async () => {
    const defaultId = '7FqRezKdV0mcUjOYerCUuJ'
    const { result } = renderUseGetGTLPlaylistConfigQuery(
      { searchGroupLabel: undefined, venueTypeCode: VenueTypeCodeKey.CONCERT_HALL },
      (data) => data.find((r) => r.id === defaultId)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(undefined)
  })

  it('should fetch gtl playlist config when a searchGroupLabel is provided', async () => {
    const defaultId = '7FqRezKdV0mcUjOYerCUuJ'
    const { result } = renderUseGetGTLPlaylistConfigQuery(
      { searchGroupLabel: 'Livres', venueTypeCode: VenueTypeCodeKey.CONCERT_HALL },
      (data) => data.find((r) => r.id === defaultId)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: { title: 'Jeunesse', layout: 'two-items', minOffers: 5 },
        offersModuleParameters: expect.objectContaining({
          title: 'Jeunesse',
          hitsPerPage: 35,
          gtlLevel: 1,
          gtlLabel: 'Jeunesse',
        }),
      })
    )
  })
})

const renderUseGetGTLPlaylistConfigQuery = <TData = GtlPlaylistRequest[]>(
  {
    searchGroupLabel,
    venueTypeCode,
  }: {
    searchGroupLabel?: ContentfulLabelCategories
    venueTypeCode?: VenueTypeCodeKey | null
  },
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  renderHook(() => useGetGTLPlaylistsConfigQuery({ searchGroupLabel, venueTypeCode }, select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
