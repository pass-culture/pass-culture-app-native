import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import {
  HeaderSearchResultsPlaceholder,
  HitPlaceholder,
} from 'ui/components/placeholders/Placeholders'

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

const renderItem = () => (
  <SkeletonContainer>
    <HitPlaceholder />
  </SkeletonContainer>
)

export const SearchResultsPlaceHolder = () => {
  return (
    <Container>
      <FlatList
        data={FAVORITE_LIST_PLACEHOLDER}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={<HeaderSearchResultsPlaceholder />}
        ListFooterComponent={<Footer />}
        scrollEnabled={false}
      />
    </Container>
  )
}

const contentContainerStyle = {
  flexGrow: 1,
}

const Container = styled.View({
  flex: 1,
})

const SkeletonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
}))

const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + theme.designSystem.size.spacing.xxxl,
  alignItems: 'center',
}))
