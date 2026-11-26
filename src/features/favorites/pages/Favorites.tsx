import React from 'react'

import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Page } from 'ui/pages/Page'

export const Favorites: React.FC = () => {
  const { isConnected } = useNetInfoContext()

  if (!isConnected) {
    return <OfflinePage />
  }

  return (
    <Page>
      <PageHeader title="Mes favoris" withMargins />
      <FavoritesResults />
    </Page>
  )
}
