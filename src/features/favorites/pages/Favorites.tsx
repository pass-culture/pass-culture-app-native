import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesHeader } from 'features/favorites/components/FavoritesHeader'
import { FavoritesResults } from 'features/favorites/components/FavoritesResults'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'
import { LoadingPage } from 'ui/components/LoadingPage'

import { useFavoritesResults } from './useFavoritesResults'

const useShowResults = () => {
  const initialShowResults = useFavoritesState().showResults
  const [showResults, setShowResults] = useState<boolean>(initialShowResults)
  const { isLoading, refetch, dataUpdatedAt, isFetching } = useFavoritesResults()

  function refetchDebounce() {
    const debounceDelayMs = 100
    const isOldData = new Date().getTime() - dataUpdatedAt > debounceDelayMs
    if (isOldData && !isFetching) {
      refetch()
    }
  }

  useFocusEffect(refetchDebounce)

  useEffect(() => {
    setShowResults(!isLoading)
  }, [isLoading])

  return showResults
}

export const FavoritesScreen: React.FC = () => {
  useKeyboardAdjust()
  const { dispatch } = useFavoritesState()
  const showResults = useShowResults()

  useEffect(() => {
    dispatch({ type: 'SHOW_RESULTS', payload: true })
  }, [dispatch])

  return (
    <Container>
      <FavoritesHeader />
      {showResults ? <FavoritesResults /> : <LoadingPage />}
    </Container>
  )
}

export const Favorites: React.FC = () => {
  const { isLoggedIn } = useAuthContext()
  if (!isLoggedIn) {
    return <LoadingPage />
  }
  return <FavoritesScreen />
}

const Container = styled.View({ flex: 1 })
