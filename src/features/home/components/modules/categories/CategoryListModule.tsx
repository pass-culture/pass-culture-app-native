import React, { useEffect, useRef } from 'react'
import { FlatList, FlatListProps, Platform, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CategoryBlock } from 'features/home/components/modules/categories/CategoryBlock'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { getSpacing, TypoDS } from 'ui/theme'

type CategoryListProps = {
  id: string
  title: string
  categoryBlockList: CategoryBlockData[]
  index: number
  homeEntryId: string
}

type StyledFlatListProps = FlatListProps<null> & {
  contentContainerStyle?: ViewStyle
}

const DESKTOP_TITLE_MARGIN = 2
const DESKTOP_CATEGORY_LIST_MARGIN = 4
const DESKTOP_CATEGORY_BLOCK_MARGIN = 2

const MOBILE_TITLE_MARGIN = 3
const MOBILE_CATEGORY_LIST_MARGIN = 5
const MOBILE_CATEGORY_BLOCK_MARGIN = 1

const keyExtractor = (_item: CategoryBlockData, index: number) => `category_block_#${index}`

const ListFooterComponent = () => <Footer />
const isWeb = Platform.OS === 'web' ? true : undefined

export const CategoryListModule = ({
  id,
  title,
  categoryBlockList,
  index,
  homeEntryId,
}: CategoryListProps) => {
  const flatListRef = useRef<FlatList<null>>(null)
  const { onScroll, onContentSizeChange, onContainerLayout } = useHorizontalFlatListScroll({
    ref: flatListRef,
    isActive: isWeb,
  })

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.CATEGORY_LIST,
      index,
      homeEntryId,
    })
  }, [id, homeEntryId, index])

  const renderItem = ({ item }: { item: CategoryBlockData; index: number }) => (
    <CategoryBlockContainer>
      <CategoryBlock
        {...item}
        onBeforePress={() => {
          analytics.logCategoryBlockClicked({
            moduleId: item.id,
            moduleListID: id,
            entryId: homeEntryId,
            toEntryId: item.homeEntryId,
          })
        }}
        navigateTo={{
          screen: 'ThematicHome',
          params: {
            homeId: item.homeEntryId,
            from: 'category_block',
            moduleId: item.id,
            moduleListId: id,
          },
        }}
      />
    </CategoryBlockContainer>
  )

  const newCategoryBlockProps = {
    key: 'horizontal',
    horizontal: true,
    scrollEnabled: true,
    showsHorizontalScrollIndicator: false,
  }

  return (
    <React.Fragment>
      <HeaderContainer>
        <TypoDS.Title3 numberOfLines={2}>{title}</TypoDS.Title3>
        <Spacer.Column
          numberOfSpaces={theme.isDesktopViewport ? DESKTOP_TITLE_MARGIN : MOBILE_TITLE_MARGIN}
        />
      </HeaderContainer>
      <FlatListContainer onLayout={onContainerLayout}>
        <StyledFlatList
          ListFooterComponent={ListFooterComponent}
          onContentSizeChange={onContentSizeChange}
          data={categoryBlockList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onScroll={onScroll}
          ref={flatListRef}
          {...newCategoryBlockProps}
        />
      </FlatListContainer>
    </React.Fragment>
  )
}

const StyledFlatList = styled.FlatList.attrs<StyledFlatListProps>(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(
      theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
    ),
  },
}))<StyledFlatListProps>``

const FlatListContainer = styled.View(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
          marginBottom: theme.isDesktopViewport
            ? getSpacing(DESKTOP_CATEGORY_LIST_MARGIN)
            : getSpacing(MOBILE_CATEGORY_LIST_MARGIN),
}))

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const CategoryBlockContainer = styled.View(({ theme }) => ({
          paddingVertical: getSpacing(
            theme.isDesktopViewport ? DESKTOP_CATEGORY_BLOCK_MARGIN : MOBILE_CATEGORY_BLOCK_MARGIN
          ),
          paddingHorizontal: getSpacing(MOBILE_CATEGORY_BLOCK_MARGIN),
}))

const Footer = styled.View(({ theme }) => ({
  height: getSpacing(
    theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
  ),
}))
