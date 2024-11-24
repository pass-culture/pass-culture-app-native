import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/pages/NotConnectedFavorites'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { UsePerformanceProfilerOptions } from 'shared/performance/types'
import { useFirebasePerformanceProfiler } from 'shared/performance/useFirebasePerformanceProfiler'
import { PageHeader } from 'ui/components/headers/PageHeader'

export const Favorites: React.FC = () => {
  const route = useRoute<UseRouteType<'Favorites'>>()
  const { isConnected } = useNetInfoContext()
  const { isLoggedIn } = useAuthContext()

  useFirebasePerformanceProfiler('Favorites', { route } as UsePerformanceProfilerOptions)

  if (!isConnected) {
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
