import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/components/NotConnectedFavorites'
import { useFavorites } from 'features/favorites/pages/useFavorites'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

const useFetchResults = () => {
  const { refetch, dataUpdatedAt, isFetching } = useFavorites()

  function refetchDebounce() {
    const debounceDelayMs = 100
    const isOldData = new Date().getTime() - dataUpdatedAt > debounceDelayMs
    if (isOldData && !isFetching) {
      refetch()
    }
  }

  useFocusEffect(refetchDebounce)
}

export const FavoritesScreen: React.FC = () => {
  useKeyboardAdjust()
  useFetchResults()

  return (
    <Container>
      <SvgPageHeader title="Mes favoris" />
      <FavoritesResults />
    </Container>
  )
}

export const Favorites: React.FC = () => {
  const { isLoggedIn } = useAuthContext()
  if (!isLoggedIn) {
    return <NotConnectedFavorites />
  }
  return <FavoritesScreen />
}

const Container = styled.View({ flex: 1 })
