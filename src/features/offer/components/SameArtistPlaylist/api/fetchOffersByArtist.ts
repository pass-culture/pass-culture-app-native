import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { HitOffer, Offer } from 'shared/offer/types'

export type FetchOfferByArtist = {
  artists: string | null | undefined
  ean: string | null | undefined
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
}: FetchOfferByArtist): Promise<HitOfferWithArtistAndEan[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)

  if (!artists) return []

  try {
    const response = await index.search<HitOfferWithArtistAndEan>('', {
      page: 0,
      filters: buildAlgoliaFilter({ artists, ean }),
      hitsPerPage: 30,
      attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.artist', 'offer.ean'],
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })

    return response.hits
  } catch (error) {
    captureAlgoliaError(error)
    return [] as HitOfferWithArtistAndEan[]
  }
}

export function buildAlgoliaFilter({ artists, ean }: FetchOfferByArtist) {
  const firstArtist = artists?.split(' ; ')[0]

  let filterString = `offer.artist:"${firstArtist}"`
  if (ean) filterString += ` AND NOT offer.ean:"${ean}"`

  return filterString
}
