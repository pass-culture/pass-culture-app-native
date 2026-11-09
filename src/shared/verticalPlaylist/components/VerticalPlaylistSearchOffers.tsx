import React from 'react'

import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'
import { VerticalPlaylistSearchOffersModule } from 'shared/verticalPlaylist/types'

type Props = { module: VerticalPlaylistSearchOffersModule }

export const VerticalPlaylistSearchOffers = ({ module }: Props) => (
  <VerticalPlaylistOffersView
    title={module.title}
    items={module.offers.hits}
    analyticsFrom="verticalplaylistoffers"
  />
)
