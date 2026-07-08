import React from 'react'

import { ArtistPlaylistModule, HomepageModuleType, OffersModule } from 'features/home/types'
import { useArtistQuery } from 'queries/artist/useArtistQuery'
import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'
import { useGetOffersFromPlaylist } from 'shared/verticalPlaylist/helpers/useGetOffersFromPlaylist'

type Props = { module: OffersModule | ArtistPlaylistModule }

export const VerticalPlaylistOffersModule = ({ module }: Props) => {
  const data = useGetOffersFromPlaylist(module)
  const { data: artist } = useArtistQuery(
    module.type === HomepageModuleType.ArtistPlaylistModule ? module.artistId : '',
    {
      throwOnError: false,
      enabled: module.type === HomepageModuleType.ArtistPlaylistModule,
    }
  )

  return (
    <VerticalPlaylistOffersView
      title={data.title}
      subtitle={data.subtitle}
      items={data.items}
      searchId={data.searchId}
      searchQuery={data.searchQuery}
      analyticsFrom="verticalplaylistoffers"
      artist={artist}
      moduleId={module.type === HomepageModuleType.ArtistPlaylistModule ? module.id : undefined}
    />
  )
}
