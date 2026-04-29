import {
  SelectSearchOffersParams,
  SelectedSearchOffers,
} from 'features/search/queries/useSearchOffersQuery/types'
import {
  getFlattenHits,
  getLastPage,
  getUniqueVenues,
  getNbHits,
  getUserData,
} from 'features/search/queries/useSearchOffersQuery/utils'

export const selectSearchOffers = ({
  data,
  transformHits,
}: SelectSearchOffersParams): SelectedSearchOffers => {
  const { pages } = data
  const [firstPage] = pages

  const offers = getFlattenHits(pages, transformHits, 'offersResponse')
  const duplicatedOffers = getFlattenHits(pages, transformHits, 'duplicatedOffersResponse')

  return {
    offers,
    duplicatedOffers,
    lastPage: getLastPage(pages),
    offerVenues: getUniqueVenues(duplicatedOffers),
    nbHits: getNbHits(firstPage, offers.length),
    userData: getUserData(firstPage),
  }
}
