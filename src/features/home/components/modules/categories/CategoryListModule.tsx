import React, { useEffect, useRef } from 'react'
import { FlatList, FlatListProps, Platform, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoryBlock } from 'features/home/components/modules/categories/CategoryBlock'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useHorizontalFlatListScroll } from 'ui/hooks/useHorizontalFlatListScroll'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

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

const DESKTOP_COLUMNS = 4
const DESKTOP_TITLE_MARGIN = 2
const DESKTOP_CATEGORY_LIST_MARGIN = 4
const DESKTOP_CATEGORY_BLOCK_MARGIN = 2
const DESKTOP_CATEGORY_BLOCK_FLEX_BASIS = `${100 / DESKTOP_COLUMNS}%` // 25%

const MOBILE_COLUMNS = 2
const MOBILE_TITLE_MARGIN = 3
const MOBILE_CATEGORY_LIST_MARGIN = 5
const MOBILE_CATEGORY_BLOCK_MARGIN = 1
const MOBILE_CATEGORY_BLOCK_FLEX_BASIS = `${100 / MOBILE_COLUMNS}%` // 50%

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
  const enableAppV2CategoryBlock = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CATEGORY_BLOCK)
  const hasCategoryBlockGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableAppV2CategoryBlock,
    homeId: homeEntryId,
  })
  const flatListRef = useRef<FlatList<null>>(null)
  const {
    handleScrollPrevious,
    handleScrollNext,
    onScroll,
    onContentSizeChange,
    onContainerLayout,
    isEnd,
    isStart,
  } = useHorizontalFlatListScroll({
    ref: flatListRef,
    isActive: hasCategoryBlockGraphicRedesign && isWeb,
  })

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.CATEGORY_LIST,
      index,
      homeEntryId,
    })
  }, [id, homeEntryId, index])

  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? DESKTOP_COLUMNS : MOBILE_COLUMNS

  const renderItem = ({ item }: { item: CategoryBlockData; index: number }) => (
    <CategoryBlockContainer enableAppV2CategoryBlock={hasCategoryBlockGraphicRedesign}>
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
        hasGraphicRedesign={hasCategoryBlockGraphicRedesign}
      />
    </CategoryBlockContainer>
  )

  const newCategoryBlockProps = {
    key: 'horizontal',
    horizontal: true,
    scrollEnabled: true,
    showsHorizontalScrollIndicator: false,
  }

  const oldCategoryBlockProps = {
    key: numColumns,
    numColumns,
    horizontal: false,
    scrollEnabled: false,
  }

  return (
    <React.Fragment>
      <HeaderContainer>
        <TypoDS.Title3 numberOfLines={2}>{title}</TypoDS.Title3>
        <Spacer.Column
          numberOfSpaces={theme.isDesktopViewport ? DESKTOP_TITLE_MARGIN : MOBILE_TITLE_MARGIN}
        />
      </HeaderContainer>
      <FlatListContainer
        enableAppV2CategoryBlock={hasCategoryBlockGraphicRedesign}
        onLayout={onContainerLayout}>
        {hasCategoryBlockGraphicRedesign && !isStart && isWeb ? (
          <PlaylistArrowButton direction="left" onPress={handleScrollPrevious} />
        ) : null}
        <StyledFlatList
          ListFooterComponent={ListFooterComponent}
          onContentSizeChange={onContentSizeChange}
          data={categoryBlockList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onScroll={onScroll}
          ref={flatListRef}
          {...(hasCategoryBlockGraphicRedesign ? newCategoryBlockProps : oldCategoryBlockProps)}
        />
        {hasCategoryBlockGraphicRedesign && !isEnd && isWeb ? (
          <PlaylistArrowButton direction="right" onPress={handleScrollNext} />
        ) : null}
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

const FlatListContainer = styled.View<{ enableAppV2CategoryBlock: boolean }>(
  ({ theme, enableAppV2CategoryBlock }) =>
    enableAppV2CategoryBlock
      ? {
          marginBottom: theme.isDesktopViewport
            ? getSpacing(DESKTOP_CATEGORY_LIST_MARGIN)
            : getSpacing(MOBILE_CATEGORY_LIST_MARGIN),
        }
      : {
          marginHorizontal: getSpacing(
            theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
          ),
        }
)

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const CategoryBlockContainer = styled.View<{ enableAppV2CategoryBlock: boolean }>(
  ({ theme, enableAppV2CategoryBlock }) =>
    enableAppV2CategoryBlock
      ? {
          paddingVertical: getSpacing(
            theme.isDesktopViewport ? DESKTOP_CATEGORY_BLOCK_MARGIN : MOBILE_CATEGORY_BLOCK_MARGIN
          ),
          paddingHorizontal: getSpacing(MOBILE_CATEGORY_BLOCK_MARGIN),
        }
      : {
          flexBasis: theme.isDesktopViewport
            ? DESKTOP_CATEGORY_BLOCK_FLEX_BASIS
            : MOBILE_CATEGORY_BLOCK_FLEX_BASIS,
          padding: getSpacing(
            theme.isDesktopViewport ? DESKTOP_CATEGORY_BLOCK_MARGIN : MOBILE_CATEGORY_BLOCK_MARGIN
          ),
        }
)

const Footer = styled.View(({ theme }) => ({
  height: getSpacing(
    theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
  ),
}))
