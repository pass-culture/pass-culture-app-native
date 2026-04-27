import { FlashList } from '@shopify/flash-list'
import React, { ComponentProps, Ref } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { FlatList, FlatList as RNGHFlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { Playlist } from 'ui/components/Playlist'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { SeeAllButton } from './SeeAllButton/SeeAllButton'

type Props = Pick<
  ComponentProps<typeof Playlist>,
  | 'data'
  | 'itemWidth'
  | 'itemHeight'
  | 'testID'
  | 'keyExtractor'
  | 'renderItem'
  | 'onEndReached'
  | 'onViewableItemsChanged'
  | 'playlistType'
  | 'tileType'
> & {
  noMarginBottom?: boolean
  title: string
  subtitle?: string
  playlistRef?: Ref<FlatList>
  FlatListComponent?: typeof FlashList | typeof RNGHFlatList
  withMargin?: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  showNewTag?: boolean
  seeAllButton?: {
    navigateToVerticalPlaylist?: InternalNavigationProps['navigateTo']
    navigateToSearchPlaylist?: InternalNavigationProps['navigateTo']
    onBeforeNavigate: () => void
    hidePlaylistSeeAll?: boolean
    hideSearchSeeAll?: boolean
  }
}

export const PassPlaylist = ({
  title,
  subtitle,
  onEndReached,
  onViewableItemsChanged,
  seeAllButton,
  data,
  itemHeight,
  itemWidth,
  renderItem,
  playlistType,
  tileType,
  keyExtractor,
  playlistRef,
  testID: _testID,
  noMarginBottom,
  FlatListComponent,
  withMargin = true,
  contentContainerStyle,
  showNewTag,
  ...props
}: Props) => {
  return (
    <StyledViewGap gap={4} noMarginBottom={noMarginBottom} {...props}>
      <ViewGap gap={1}>
        <StyledView>
          <TitleContainer>
            <AccessibleTitle
              withMargin={withMargin}
              TitleComponent={TitleLevel2}
              title={title}
              withTag={showNewTag}
            />
          </TitleContainer>
          <SeeAllButtonContainer>
            <SeeAllButton playlistTitle={title} data={seeAllButton} />
          </SeeAllButtonContainer>
          {showNewTag ? (
            <TagContainer>
              <Tag label="Nouveau" variant={TagVariant.NEW} />
            </TagContainer>
          ) : undefined}
        </StyledView>
        {subtitle ? <StyledSubtitle withMargin={withMargin}>{subtitle}</StyledSubtitle> : null}
      </ViewGap>
      <Playlist
        testID="offersModuleList"
        data={data}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        scrollButtonOffsetY={itemHeight / 2}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        playlistType={playlistType}
        tileType={tileType}
        ref={playlistRef}
        onViewableItemsChanged={onViewableItemsChanged}
        FlatListComponent={FlatListComponent}
        contentContainerStyle={contentContainerStyle}
      />
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)<{ noMarginBottom?: boolean }>(
  ({ noMarginBottom, theme }) => ({
    paddingBottom: noMarginBottom ? 0 : theme.home.spaceBetweenModules,
  })
)

const TitleLevel2 = styled(Typo.Title3).attrs(getHeadingAttrs(2))``

const StyledSubtitle = styled(Typo.BodyAccentXs).attrs<{
  windowWidth?: number
  withMargin?: boolean
}>({
  numberOfLines: 2,
})(({ withMargin, theme }) => ({
  marginHorizontal: withMargin ? theme.contentPage.marginHorizontal : undefined,
  color: theme.designSystem.color.text.subtle,
}))

const StyledView = styled.View({
  flexDirection: 'row',
})

const TagContainer = styled.View(({ theme }) => ({
  marginRight: theme.designSystem.size.spacing.xl,
  flexShrink: 0,
  justifyContent: 'center',
}))

const SeeAllButtonContainer = styled.View(({ theme }) => ({
  marginRight: theme.contentPage.marginHorizontal,
  justifyContent: 'center',
}))

const TitleContainer = styled.View(({ theme }) => ({
  flex: theme.isDesktopViewport ? undefined : 1,
}))
