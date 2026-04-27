import { SelectSearchOffersParams } from 'features/search/queries/useSearchOffersQuery/types'
import { SearchListContent, SearchOfferHits, SearchResultItem } from 'features/search/types'
import { plural } from 'libs/plural'

export const getHelmetTitle = (query: string, nbHits: number) => {
  const numberOfResults = nbHits
    ? plural(nbHits, {
        singular: '# résultat',
        plural: '# résultats',
      })
    : 'Pas de résultat'
  const searchStateQuery = query ? ` pour ${query}` : ''
  return `${numberOfResults + searchStateQuery} | Recherche | pass Culture`
}

type Args = {
  selectedFilter: SelectSearchOffersParams['selectedFilter']
  hits: SearchOfferHits
  nbHits: number
}
export const getSearchListContent = ({ selectedFilter, hits, nbHits }: Args): SearchListContent => {
  let items: SearchResultItem[] = []
  let title = ''
  let hitsNumber = 0

  switch (selectedFilter) {
    case 'Lieux':
      title = 'Les lieux culturels'
      items = hits.venues.map((venue) => ({ type: 'venue', data: venue }))
      hitsNumber = hits.venues.length
      break
    case 'Artistes':
      title = 'Les artistes'
      items = hits.artists.map((artist) => ({ type: 'artist', data: artist }))
      hitsNumber = hits.artists.length
      break
    default:
      title = 'Les offres'
      items = hits.offers.map((offer) => ({ type: 'offer', data: offer }))
      hitsNumber = nbHits
      break
  }

  return {
    items,
    title,
    nbHits: hitsNumber,
    hits,
  }
}
