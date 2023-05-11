import { UseQueryResult } from 'react-query'

import { OffersData, Venue, VenuesData } from 'features/home/types'

interface MergeProps {
  offersResultList: UseQueryResult<OffersData | VenuesData, unknown>[]
  venuesResultList: UseQueryResult<{ hits: Venue[][]; moduleId: string[] }, unknown>
}

export const mergeOffersAndVenuesData = ({ offersResultList, venuesResultList }: MergeProps) => {
  const mergedData: (OffersData | VenuesData)[] = []

  if (venuesResultList.data) {
    for (let i = 0; i < venuesResultList.data.hits.length; i++) {
      mergedData.push({
        hits: venuesResultList.data.hits[i],
        moduleId: venuesResultList.data.moduleId[i],
      } as VenuesData)
    }
  }

  if (offersResultList) {
    offersResultList.forEach((result) => {
      if (result.data) {
        mergedData.push(result.data as OffersData)
      }
    })
  }

  return mergedData
}
