import { UseQueryResult } from 'react-query'

import { Venue, ModuleData } from 'features/home/types'

interface MergeProps {
  offersResultList: UseQueryResult<ModuleData, unknown>[]
  venuesResultList: UseQueryResult<{ hits: Venue[][]; moduleId: string[] }, unknown>
}

export const mergeOffersAndVenuesData = ({ offersResultList, venuesResultList }: MergeProps) => {
  const mergedData: ModuleData[] = []

  if (venuesResultList.data) {
    for (let i = 0; i < venuesResultList.data.hits.length; i++) {
      mergedData.push({
        hits: venuesResultList.data.hits[i],
        nbHits: venuesResultList.data.hits.length,
        moduleId: venuesResultList.data.moduleId[i],
      } as ModuleData)
    }
  }

  if (offersResultList) {
    offersResultList.forEach((result) => {
      if (result.data) {
        mergedData.push(result.data)
      }
    })
  }

  return mergedData
}
