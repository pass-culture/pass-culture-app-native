import { Coordinates, SearchGroupNameEnumv2 } from 'api/gen'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { convertKmToMeters } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { env } from 'libs/environment'
import { HitOffer, Offer } from 'shared/offer/types'

type BuildAlgoliaFilterType = {
  artists?: string | null
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  searchGroupName: SearchGroupNameEnumv2
  venueLocation: Coordinates
}

export type HitOfferWithArtistAndEan = Offer & {
  offer: HitOffer & {
    artist: string
    ean: string
  }
}

export const EXCLUDED_ARTISTS = ['collectif', 'collectifs']

export const fetchOffersByArtist = async ({
  artists,
  searchGroupName,
  venueLocation,
}: FetchOfferByArtist): Promise<HitOfferWithArtistAndEan[]> => {
  const index = client.initIndex(env.ALGOLIA_TOP_OFFERS_INDEX_NAME)

  if (
    !artists ||
    EXCLUDED_ARTISTS.includes(artists.toLowerCase()) ||
    searchGroupName !== SearchGroupNameEnumv2.LIVRES
  )
    return []

  try {
    const response = await index.search<HitOfferWithArtistAndEan>('', {
      page: 0,
      filters: buildAlgoliaFilter({ artists }),
      hitsPerPage: 100,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [], // We disable highlighting because we don't need it
      aroundRadius: venueLocation ? convertKmToMeters(DEFAULT_RADIUS) : 'all',
      aroundLatLng:
        venueLocation.latitude && venueLocation.longitude
          ? `${venueLocation.latitude}, ${venueLocation.longitude}`
          : undefined,
    })

    return response.hits
  } catch (error) {
    captureAlgoliaError(error)
    return []
  }
}

export function buildAlgoliaFilter({ artists }: BuildAlgoliaFilterType) {
  const firstArtist = artists?.split(' ; ')[0]

  if (!firstArtist) return ''

  return `offer.artist:"${firstArtist}"`
}
