import { UseQueryResult } from '@tanstack/react-query'

import { Venue, ModuleData } from 'features/home/types'

export const mapVenuesDataAndModules = (
  venuesResultList: UseQueryResult<{ hits: Venue[][]; moduleId: string[] }, unknown>
) => {
  const venuesModulesData: ModuleData[] = []

  if (venuesResultList.data) {
    for (let i = 0; i < venuesResultList.data.hits.length; i++) {
      venuesModulesData.push({
        // @ts-expect-error: because of noUncheckedIndexedAccess
        playlistItems: venuesResultList.data.hits[i],
        // @ts-expect-error: because of noUncheckedIndexedAccess
        moduleId: venuesResultList.data.moduleId[i],
      })
    }
  }

  return venuesModulesData
}
