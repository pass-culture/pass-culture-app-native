import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { NotConnectedFavorites } from 'features/favorites/components/NotConnectedFavorites'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

import { useFavoritesResults } from './useFavoritesResults'

const useFetchResults = () => {
  const { refetch, dataUpdatedAt, isFetching } = useFavoritesResults()

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
  const { dispatch } = useFavoritesState()
  useFetchResults()

  useEffect(() => {
    dispatch({ type: 'SHOW_RESULTS', payload: true })
  }, [dispatch])

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
