import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/components/NotConnectedFavorites'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { PageHeader } from 'ui/components/headers/PageHeader'

export const Favorites: React.FC = () => {
  const netInfo = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  if (!isLoggedIn) {
    return <NotConnectedFavorites />
  }

  return (
    <Container>
      <PageHeader title="Mes favoris" />
      <FavoritesResults />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
