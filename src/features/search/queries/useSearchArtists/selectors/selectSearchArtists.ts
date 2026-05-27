import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'
import { Artist } from 'features/venue/types'

export const selectSearchArtists = (data: FetchSearchArtistsResponse | null): Artist[] =>
  data?.artistsResponse.hits.map((artist) => ({
    id: artist.objectID,
    name: artist.name,
    image: artist.image,
    description: artist.description,
  })) || []
