import { SearchGroupNameEnumv2 } from 'api/gen'
import { EXCLUDED_ARTISTS } from 'features/offer/helpers/constants'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { Position } from 'libs/location'
import { HitOffer, Offer } from 'shared/offer/types'

type BuildAlgoliaFilterType = {
  artists?: string | null
}

export type FetchOfferByArtist = BuildAlgoliaFilterType & {
  searchGroupName: SearchGroupNameEnumv2
  userLocation: Position
}

export type HitOfferWithArtistAndEan = Offer & {
  offer: HitOffer & {
    artist: string
    ean: string
  }
}

export const fetchOffersByArtist = async ({
  artists,
  searchGroupName,
  userLocation,
}: FetchOfferByArtist): Promise<HitOfferWithArtistAndEan[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME_B)

  if (
    !artists ||
    EXCLUDED_ARTISTS.includes(artists.toLowerCase()) ||
    (searchGroupName !== SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE &&
      searchGroupName !== SearchGroupNameEnumv2.LIVRES)
  )
    return []

  try {
    const response = await index.search<HitOfferWithArtistAndEan>('', {
      page: 0,
      filters: buildAlgoliaFilter({ artists }),
      hitsPerPage: 100,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [], // We disable highlighting because we don't need it
      aroundRadius: 'all',
      aroundLatLng: userLocation
        ? `${userLocation.latitude}, ${userLocation.longitude}`
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
