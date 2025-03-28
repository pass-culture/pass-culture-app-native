import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/pages/NotConnectedFavorites'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Page } from 'ui/pages/Page'

export const Favorites: React.FC = () => {
  const { isConnected } = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  if (!isConnected) {
    return <OfflinePage />
  }

  if (!isLoggedIn) {
    return <NotConnectedFavorites />
  }

  return (
    <Page>
      <PageHeader title="Mes favoris" />
      <FavoritesResults />
    </Page>
  )
}
