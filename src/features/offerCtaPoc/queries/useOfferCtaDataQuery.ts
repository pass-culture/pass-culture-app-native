import { useQuery } from '@tanstack/react-query'

import {
  OfferCtaApiResponse,
  offerCtaResponseToData,
} from 'features/offerCtaPoc/adapters/offerCtaResponseToData'
import { Scenario, SCENARIOS } from 'features/offerCtaPoc/fixtures/scenarios'

// SERVER boundary (React Query).
// - `queryFn` returns the RAW API DTO (`OfferCtaApiResponse`), as a real backend would.
// - `select` ADAPTS the DTO to the domain shape (`OfferCtaData`) — this is the
//   correct use of React Query's selector: reshape/narrow server data, memoized.
//   It does NOT take any business decision (that lives in the pure core).
export const useOfferCtaDataQuery = (scenario: Scenario) =>
  useQuery({
    queryKey: ['offerCtaPoc', scenario],
    queryFn: async (): Promise<OfferCtaApiResponse> => SCENARIOS[scenario],
    select: offerCtaResponseToData,
  })
