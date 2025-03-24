import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'

export const findArtistById = (hits: AlgoliaOfferWithArtistAndEan[], artistId: string) =>
  hits
    .find((hit) => hit.artists?.some((a) => a?.id === artistId))
    ?.artists?.find((a) => a?.id === artistId)
