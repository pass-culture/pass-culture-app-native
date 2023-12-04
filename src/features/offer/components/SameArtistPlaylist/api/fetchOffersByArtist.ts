import { Coordinates, SearchGroupNameEnumv2 } from 'api/gen'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { convertKmToMeters } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { env } from 'libs/environment'
import { HitOffer, Offer } from 'shared/offer/types'

type BuildAlgoliaFilterType = {
  artists: string | null | undefined
  ean: string | null | undefined
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  searchGroupName: SearchGroupNameEnumv2 | undefined
  venueLocation: Coordinates | undefined
}

export type HitOfferWithArtistAndEan = Offer & {
  offer: HitOffer & {
    artist: string
    ean: string
  }
}

export const fetchOffersByArtist = async ({
  artists,
  ean,
  searchGroupName,
  venueLocation,
}: FetchOfferByArtist): Promise<HitOfferWithArtistAndEan[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)

  if (!artists || searchGroupName !== SearchGroupNameEnumv2.LIVRES) return []

  try {
    const response = await index.search<HitOfferWithArtistAndEan>('', {
      page: 0,
      filters: buildAlgoliaFilter({ artists, ean }),
      hitsPerPage: 30,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [], // We disable highlighting because we don't need it
      aroundRadius: venueLocation ? convertKmToMeters(DEFAULT_RADIUS) : 'all',
      aroundLatLng: venueLocation
        ? `${venueLocation.latitude}, ${venueLocation.longitude}`
        : undefined,
    })

    return response.hits
  } catch (error) {
    captureAlgoliaError(error)
    return [] as HitOfferWithArtistAndEan[]
  }
}

export function buildAlgoliaFilter({ artists, ean }: BuildAlgoliaFilterType) {
  const firstArtist = artists?.split(' ; ')[0]

  let filterString = `offer.artist:"${firstArtist}"`
  if (ean) filterString += ` AND NOT offer.ean:"${ean}"`

  return filterString
}
