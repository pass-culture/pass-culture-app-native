import { api } from 'api/api'
import { MovieCalendarResponseV2, VenueMovieCalendarResponseV2 } from 'api/gen'
import { mockServer } from 'tests/mswServer'

describe('movie calendar V2 API', () => {
  it('calls the movie calendar V2 route', async () => {
    const response: MovieCalendarResponseV2 = { calendar: [] }
    mockServer.getApi<MovieCalendarResponseV2>('/v2/movie/calendar', response)

    await expect(
      api.getNativeV2MovieCalendar(48.86, 2.35, '123', undefined, 50_000)
    ).resolves.toEqual(response)
  })

  it('calls the venue movie calendar V2 route', async () => {
    const response: VenueMovieCalendarResponseV2 = { calendar: [] }
    mockServer.getApi<VenueMovieCalendarResponseV2>('/v2/venue/123/movie/calendar', response)

    await expect(api.getNativeV2VenuevenueIdMovieCalendar(123)).resolves.toEqual(response)
  })
})
