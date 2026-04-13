import { DisabilitiesProperties } from 'features/accessibility/types'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
import { removeGeolocFromVenue } from 'features/search/helpers/searchList/removeGeolocFromVenue'
import { SelectSearchOffersParams } from 'features/search/queries/useSearchOffersQuery/types'
import { SearchOfferHits, SearchResultItem } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
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
  disabilities: DisabilitiesProperties
  selectedFilter: SelectSearchOffersParams['selectedFilter']
  venuesPlaylistTitle: string | undefined
  selectedLocationMode: LocationMode
  hits: SearchOfferHits
  nbHits: number
}
export const getSearchListContent = ({
  disabilities,
  selectedFilter,
  venuesPlaylistTitle,
  selectedLocationMode,
  hits,
  nbHits,
}: Args) => {
  const shouldDisplayAccessibilityContent = Object.values(disabilities).filter(Boolean).length > 0
  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesPlaylistTitle,
    selectedLocationMode !== LocationMode.EVERYWHERE
  )
  const offersContentTitle = `Les offres${shouldDisplayAccessibilityContent ? ' dans des lieux accessibles' : ''}`

  const venues = hits.venueNotOpenToPublic[0]
    ? [removeGeolocFromVenue(hits.venueNotOpenToPublic[0]), ...hits.venues]
    : hits.venues

  let listItems: SearchResultItem[] = []
  let listTitle = ''
  let listNbHits = 0

  switch (selectedFilter) {
    case 'Lieux':
      listTitle = venuePlaylistTitle
      listItems = venues.map((venue) => ({ type: 'venue', data: venue }))
      listNbHits = venues.length
      break
    case 'Artistes':
      listTitle = 'Les artistes'
      listItems = hits.artists.map((artist) => ({ type: 'artist', data: artist }))
      listNbHits = hits.artists.length
      break
    default:
      listTitle = offersContentTitle
      listItems = hits.offers.map((offer) => ({ type: 'offer', data: offer }))
      listNbHits = nbHits
      break
  }

  return {
    listItems,
    listTitle,
    listNbHits,
    rawHits: hits,
  }
}
