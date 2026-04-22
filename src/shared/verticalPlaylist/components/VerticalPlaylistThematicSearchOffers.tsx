import React from 'react'

import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'

type Props = { module: ThematicSearchPlaylistData }

export const VerticalPlaylistThematicSearchOffers = ({ module }: Props) => (
  <VerticalPlaylistOffersView
    title={module.title}
    items={module.offers.hits}
    analyticsFrom="verticalplaylistoffers"
  />
)
