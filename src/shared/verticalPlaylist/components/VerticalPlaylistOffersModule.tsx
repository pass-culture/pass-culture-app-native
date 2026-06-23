import React from 'react'

import { ArtistPlaylistModule, HomepageModuleType, OffersModule } from 'features/home/types'
import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'
import { useGetOffersFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetOffersFromPlaylist'

type Props = { module: OffersModule | ArtistPlaylistModule }

export const VerticalPlaylistOffersModule = ({ module }: Props) => {
  const data = useGetOffersFromPlaylist(module)

  return (
    <VerticalPlaylistOffersView
      title={data.title}
      subtitle={data.subtitle}
      items={data.items}
      searchId={data.searchId}
      searchQuery={data.searchQuery}
      analyticsFrom="verticalplaylistoffers"
      artistId={
        module.type === HomepageModuleType.ArtistPlaylistModule ? module.artistId : undefined
      }
    />
  )
}
