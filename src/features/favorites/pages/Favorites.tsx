import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/components/NotConnectedFavorites'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

export const Favorites: React.FC = () => {
  useKeyboardAdjust()
  const { isLoggedIn } = useAuthContext()

  if (!isLoggedIn) return <NotConnectedFavorites />

  return (
    <Container>
      <SvgPageHeader title={t`Mes favoris`} />
      <FavoritesResults />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
