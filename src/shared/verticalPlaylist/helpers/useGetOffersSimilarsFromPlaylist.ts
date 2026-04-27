import { PlaylistType } from 'features/offer/enums'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { SimilarOfferPlaylist } from 'shared/offer/types'
import { OffersSimilars, VerticalPlaylistData } from 'shared/verticalPlaylist/types'

type SimilarOfferPlaylistWithHits = Omit<SimilarOfferPlaylist, 'handleChangePlaylistDisplay'> & {
  nbHits?: number
}

export const useGetOffersSimilarsFromPlaylist = ({
  offer,
  offerSearchGroup,
  searchGroupList,
  type,
}: OffersSimilars): VerticalPlaylistData => {
  const { sameCategorySimilarOffers, otherCategoriesSimilarOffers } = useOfferPlaylist({
    offer,
    offerSearchGroup,
    searchGroupList,
  })

  const sameCategorySimilarOffersPlaylist: SimilarOfferPlaylistWithHits = {
    type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    title: 'Dans la même catégorie',
    offers: sameCategorySimilarOffers,
    nbHits: sameCategorySimilarOffers?.length,
  }

  const otherCategoriesSimilarOffersPlaylist: SimilarOfferPlaylistWithHits = {
    type: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
    title: 'Ça peut aussi te plaire',
    offers: otherCategoriesSimilarOffers,
    nbHits: otherCategoriesSimilarOffers?.length,
  }

  const similarOffersPlaylist: SimilarOfferPlaylistWithHits[] = [
    sameCategorySimilarOffersPlaylist,
    otherCategoriesSimilarOffersPlaylist,
  ]

  const selectedPlaylist = similarOffersPlaylist.find((playlist) => playlist.type === type)
  const items = selectedPlaylist?.offers?.slice(0, selectedPlaylist.nbHits ?? 0) ?? []
  const title = selectedPlaylist?.title ?? ''

  return { items, title }
}
