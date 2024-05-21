import React, { useEffect } from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoryBlock } from 'features/home/components/modules/categories/CategoryBlock'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { CircleNavButtons } from '../../CircleNavButtons/CircleNavButtons'

type CategoryListProps = {
  id: string
  title: string
  categoryBlockList: CategoryBlockData[]
  index: number
  homeEntryId: string
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

export const CategoryListModule = ({
  id,
  title,
  categoryBlockList,
  index,
  homeEntryId,
}: CategoryListProps) => {
  const isCircleNavButtonsDisplayed = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_CIRCLE_NAV_BUTTONS
  )
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage(id, ContentTypes.CATEGORY_LIST, index, homeEntryId)
  }, [id, homeEntryId, index])

  const enableAppV2CategoryBlock = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CATEGORY_BLOCK)

  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? DESKTOP_COLUMNS : MOBILE_COLUMNS

  const renderItem = ({ item, index }: { item: CategoryBlockData; index: number }) => (
    <CategoryBlockContainer
      isLast={index === categoryBlockList.length - 1}
      enableAppV2CategoryBlock={enableAppV2CategoryBlock}>
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

  const oldCategoryBlockProps = {
    key: numColumns,
    numColumns,
    horizontal: false,
    scrollEnabled: false,
  }

  return (
    <React.Fragment>
      <HeaderContainer>
        <Typo.Title3 numberOfLines={2}>{title}</Typo.Title3>
        <Spacer.Column
          numberOfSpaces={theme.isDesktopViewport ? DESKTOP_TITLE_MARGIN : MOBILE_TITLE_MARGIN}
        />
      </HeaderContainer>
      <FlatListContainer enableAppV2CategoryBlock={enableAppV2CategoryBlock}>
        <FlatList
          ListFooterComponent={ListFooterComponent}
          data={categoryBlockList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          {...(enableAppV2CategoryBlock ? newCategoryBlockProps : oldCategoryBlockProps)}
        />
      </FlatListContainer>
      {isCircleNavButtonsDisplayed ? <CircleNavButtons /> : null}
    </React.Fragment>
  )
}

const FlatListContainer = styled.View<{ enableAppV2CategoryBlock: boolean }>(
  ({ theme, enableAppV2CategoryBlock }) => ({
    ...(enableAppV2CategoryBlock
      ? {
          marginLeft: getSpacing(
            theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
          ),
          marginBottom: theme.isDesktopViewport
            ? getSpacing(DESKTOP_CATEGORY_LIST_MARGIN)
            : getSpacing(MOBILE_CATEGORY_LIST_MARGIN),
        }
      : {
          marginHorizontal: getSpacing(
            theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
          ),
        }),
  })
)

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const CategoryBlockContainer = styled.View<{ isLast: boolean; enableAppV2CategoryBlock: boolean }>(
  ({ theme, isLast, enableAppV2CategoryBlock }) => ({
    ...(enableAppV2CategoryBlock && isLast
      ? {
          marginRight: theme.isDesktopViewport
            ? getSpacing(DESKTOP_CATEGORY_LIST_MARGIN)
            : getSpacing(MOBILE_CATEGORY_LIST_MARGIN),
        }
      : {}),
    ...(enableAppV2CategoryBlock
      ? {}
      : {
          flexBasis: theme.isDesktopViewport
            ? DESKTOP_CATEGORY_BLOCK_FLEX_BASIS
            : MOBILE_CATEGORY_BLOCK_FLEX_BASIS,
        }),
    padding: getSpacing(
      theme.isDesktopViewport ? DESKTOP_CATEGORY_BLOCK_MARGIN : MOBILE_CATEGORY_BLOCK_MARGIN
    ),
  })
)

const Footer = styled.View(({ theme }) => ({
  height: getSpacing(
    theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
  ),
}))
