import React, { FunctionComponent, useCallback } from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SortButton } from 'features/favorites/components/SortButton'
import { LineSeparator } from 'ui/components/LineSeparator'
import {
  FavoriteHitPlaceholder,
  NumberOfResultsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 10 }).map((_, index) => ({
  key: index.toString(),
}))

export const FavoritesResultsPlaceholder: FunctionComponent = () => {
  const { designSystem } = useTheme()

  const renderItem = useCallback(() => <FavoriteHitPlaceholder />, [])

  return (
    <React.Fragment>
      <SortButton />
      <Container testID="FavoritesResultsPlaceHolder">
        <FlatList
          data={FAVORITE_LIST_PLACEHOLDER}
          renderItem={renderItem}
          ListHeaderComponent={<NumberOfResultsPlaceholder />}
          ItemSeparatorComponent={LineSeparator}
          scrollEnabled={false}
          contentContainerStyle={contentContainerStyle(designSystem)}
        />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  marginTop: theme.designSystem.size.spacing.xl,
}))

const contentContainerStyle = (designSystem) => ({
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT + designSystem.size.spacing.l,
})
