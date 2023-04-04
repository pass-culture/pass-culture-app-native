import React, { useEffect } from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CategoryBlock } from 'features/home/components/modules/categories/CategoryBlock'
import {
  getDesktopColorFilter,
  getMobileColorFilter,
} from 'features/home/components/modules/categories/helpers/getColorFilter'
import { CategoryBlock as CategoryBlockData } from 'features/home/types'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage(id, ContentTypes.CATEGORY_LIST, index, homeEntryId)
  }, [id, homeEntryId, index])

  const theme = useTheme()
  const numColumns = theme.isDesktopViewport ? DESKTOP_COLUMNS : MOBILE_COLUMNS

  const renderItem = ({ item, index }: { item: CategoryBlockData; index: number }) => (
    <CategoryBlockContainer>
      <CategoryBlock
        {...item}
        filter={
          theme.isDesktopViewport ? getDesktopColorFilter(index) : getMobileColorFilter(index)
        }
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

  return (
    <React.Fragment>
      <HeaderContainer>
        <Typo.Title3 numberOfLines={2}>{title}</Typo.Title3>
        <Spacer.Column
          numberOfSpaces={theme.isDesktopViewport ? DESKTOP_TITLE_MARGIN : MOBILE_TITLE_MARGIN}
        />
      </HeaderContainer>
      <FlatListContainer>
        <FlatList
          key={numColumns} // update key to avoid the following error: Changing numColumns on the fly is not supported
          ListFooterComponent={ListFooterComponent}
          data={categoryBlockList}
          numColumns={numColumns}
          horizontal={false}
          renderItem={renderItem}
          scrollEnabled={false}
          keyExtractor={keyExtractor}
        />
      </FlatListContainer>
    </React.Fragment>
  )
}

const FlatListContainer = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(
    theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
  ),
}))

const HeaderContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const CategoryBlockContainer = styled.View(({ theme }) => ({
  padding: getSpacing(
    theme.isDesktopViewport ? DESKTOP_CATEGORY_BLOCK_MARGIN : MOBILE_CATEGORY_BLOCK_MARGIN
  ),
  flexBasis: theme.isDesktopViewport
    ? DESKTOP_CATEGORY_BLOCK_FLEX_BASIS
    : MOBILE_CATEGORY_BLOCK_FLEX_BASIS,
}))

const Footer = styled.View(({ theme }) => ({
  height: getSpacing(
    theme.isDesktopViewport ? DESKTOP_CATEGORY_LIST_MARGIN : MOBILE_CATEGORY_LIST_MARGIN
  ),
}))
