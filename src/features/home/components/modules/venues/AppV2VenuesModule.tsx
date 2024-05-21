import React from 'react'

import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { ModuleData } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'

type Props = {
  data?: ModuleData
}

export const AppV2VenuesModule = ({ data }: Props) => {
  const { playlistItems = [] } = data ?? { playlistItems: [] }

  if (playlistItems.length === 0) return null

  return <VenueListModule venues={playlistItems.slice(0, 4) as VenueHit[]} />
}
