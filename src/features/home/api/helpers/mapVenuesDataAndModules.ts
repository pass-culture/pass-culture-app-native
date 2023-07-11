import { UseQueryResult } from 'react-query'

import { Venue, ModuleData } from 'features/home/types'

export const mapVenuesDataAndModules = (
  venuesResultList: UseQueryResult<{ hits: Venue[][]; moduleId: string[] }, unknown>
) => {
  const venuesModulesData: ModuleData[] = []

  if (venuesResultList.data) {
    for (let i = 0; i < venuesResultList.data.hits.length; i++) {
      venuesModulesData.push({
        playlistItems: venuesResultList.data.hits[i],
        nbHits: venuesResultList.data.hits.length,
        moduleId: venuesResultList.data.moduleId[i],
      })
    }
  }

  return venuesModulesData
}
