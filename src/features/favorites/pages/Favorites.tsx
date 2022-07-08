import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/components/NotConnectedFavorites'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useNetInfo } from 'libs/network/useNetInfo'
import { SvgPageHeader } from 'ui/components/headers/SvgPageHeader'

export const Favorites: React.FC = () => {
  const netInfo = useNetInfo()
  const { isLoggedIn } = useAuthContext()

  if (!netInfo.isConnected) {
    return <OfflinePage />
  } else if (!isLoggedIn) {
    return <NotConnectedFavorites />
  }

  return (
    <Container>
      <SvgPageHeader title={t`Mes favoris`} />
      <FavoritesResults />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
