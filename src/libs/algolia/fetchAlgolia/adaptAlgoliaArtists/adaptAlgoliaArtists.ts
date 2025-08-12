import { Artist } from 'features/venue/types'
import { AlgoliaArtist } from 'libs/algolia/types'

export const adaptAlgoliaArtists = (artists: AlgoliaArtist[]): Artist[] =>
  artists.map((artist) => ({
    id: artist.objectID,
    name: artist.name,
    image: artist.image,
    description: artist.description,
  }))
