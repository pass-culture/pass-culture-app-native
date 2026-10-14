import { useMemo } from 'react'

import { buildFreeDigitalOffersModule } from 'features/generalPublicHome/helpers/buildFreeDigitalOffersModule'
import { FreeDigitalPlaylistId } from 'features/generalPublicHome/types'
import { useGetOffersModuleDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { ModuleData, OffersModule } from 'features/home/types'

type FreeDigitalOffersQueryResult = {
  module: OffersModule
  data: ModuleData | undefined
}

export const useFreeDigitalOffersQuery = (
  playlistId: FreeDigitalPlaylistId
): FreeDigitalOffersQueryResult => {
  const module = useMemo(() => buildFreeDigitalOffersModule(playlistId), [playlistId])
  const { data } = useGetOffersModuleDataQuery(module)

  return { module, data }
}
