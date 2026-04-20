import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'

import { useOffersFromModulePlaylistData } from '../helpers/useOffersFromModulePlaylistData'

import { VerticalPlaylistOffersPage } from './VerticalPlaylistOffersPage'

export const VerticalPlaylistOffersFromModule = () => {
  const { params } = useRoute<UseRouteType<'VerticalPlaylistOffersFromModule'>>()
  const data = useOffersFromModulePlaylistData({ module: params.module })

  return (
    <VerticalPlaylistOffersPage
      title={data.title}
      subtitle={data.subtitle}
      items={data.items}
      searchId={data.searchId}
      searchQuery={data.searchQuery}
      analyticsFrom="verticalplaylistoffersfrommodule"
    />
  )
}
