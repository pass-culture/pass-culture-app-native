import { removeGeolocFromVenue } from 'features/search/helpers/searchList/removeGeolocFromVenue'
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
  const venues = hits.venueNotOpenToPublic[0]
    ? [removeGeolocFromVenue(hits.venueNotOpenToPublic[0]), ...hits.venues]
    : hits.venues

  let items: SearchResultItem[] = []
  let title = ''
  let hitsNumber = 0

  switch (selectedFilter) {
    case 'Lieux':
      title = 'Les lieux culturels'
      items = venues.map((venue) => ({ type: 'venue', data: venue }))
      hitsNumber = venues.length
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
    hits: { ...hits, venues },
  }
}
