// first page is 0
import { SearchOfferResponse } from 'features/search/api/useSearchResults/useSearchResults'

export const getNextPageParam = ({ offers: { nbPages, page } }: SearchOfferResponse) =>
  page + 1 < nbPages ? page + 1 : undefined
