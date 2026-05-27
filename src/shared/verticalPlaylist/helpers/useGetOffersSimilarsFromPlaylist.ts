import { PlaylistType } from 'features/offer/enums'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { SimilarOfferPlaylist } from 'shared/offer/types'
import { OffersSimilars, VerticalPlaylistOffersData } from 'shared/verticalPlaylist/types'

type SimilarOfferPlaylistWithHits = Omit<SimilarOfferPlaylist, 'handleChangePlaylistDisplay'> & {
  nbHits?: number
}

export const useGetOffersSimilarsFromPlaylist = ({
  offer,
  offerCategory,
  offerSearchGroup,
  searchGroupList,
  type,
}: OffersSimilars): VerticalPlaylistOffersData => {
  const {
    sameCategorySimilarOffers,
    otherCategoriesSimilarOffers,
    booksSameCategorySimilarOffers,
  } = useOfferPlaylist({
    offer,
    offerCategory,
    offerSearchGroup,
    searchGroupList,
  })

  const sameCategorySimilarOffersPlaylist: SimilarOfferPlaylistWithHits = {
    type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    title: 'Les fans aiment aussi',
    offers: sameCategorySimilarOffers,
    nbHits: sameCategorySimilarOffers?.length,
  }

  const booksSameCategorySimilarOffersPlaylist: SimilarOfferPlaylistWithHits = {
    type: PlaylistType.BOOKS_SAME_CATEGORY_SIMILAR_OFFERS,
    title: 'Dans la même catégorie',
    offers: booksSameCategorySimilarOffers,
    nbHits: booksSameCategorySimilarOffers?.length,
  }

  const otherCategoriesSimilarOffersPlaylist: SimilarOfferPlaylistWithHits = {
    type: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
    title: 'Ça peut aussi te plaire',
    offers: otherCategoriesSimilarOffers,
    nbHits: otherCategoriesSimilarOffers?.length,
  }

  const similarOffersPlaylist: SimilarOfferPlaylistWithHits[] = [
    sameCategorySimilarOffersPlaylist,
    booksSameCategorySimilarOffersPlaylist,
    otherCategoriesSimilarOffersPlaylist,
  ]

  const selectedPlaylist = similarOffersPlaylist.find((playlist) => playlist.type === type)
  const items = selectedPlaylist?.offers?.slice(0, selectedPlaylist.nbHits ?? 0) ?? []
  const title = selectedPlaylist?.title ?? ''

  return { items, title }
}
