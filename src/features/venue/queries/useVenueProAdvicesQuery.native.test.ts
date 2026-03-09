import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { venueProAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { useVenueProAdvicesQuery } from 'features/venue/queries/useVenueProAdvicesQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

describe('useVenueProAdvicesQuery', () => {
  beforeEach(() =>
    mockServer.getApi(`/v1/venue/${venueDataTest.id}/advices`, venueProAdvicesFixture)
  )

  it('should call API otherwise when wipProReviewsVenue FF activated', async () => {
    const { result } = renderHook(
      () =>
        useVenueProAdvicesQuery({
          venueId: venueDataTest.id,
          enableProAdvices: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() =>
      expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(venueProAdvicesFixture))
    )
  })

  it('should not call API otherwise when wipProReviewsVenue FF deactivated', async () => {
    const { result } = renderHook(
      () =>
        useVenueProAdvicesQuery({
          venueId: venueDataTest.id,
          enableProAdvices: false,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(JSON.stringify(result.current.data)).toEqual(undefined))
  })
})
