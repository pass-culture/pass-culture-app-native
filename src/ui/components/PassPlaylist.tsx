import { FlashList } from '@shopify/flash-list'
import React, { ComponentProps, Ref, useCallback } from 'react'
import { FlatList, FlatList as RNGHFlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { Playlist, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { SeeMoreWithEye } from './SeeMoreWithEye'

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
  onPressSeeMore?: () => void
  renderFooter?: RenderFooterItem
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
  playlistRef?: Ref<FlatList>
  FlatListComponent?: typeof FlashList | typeof RNGHFlatList
  withMargin?: boolean
}

export const PassPlaylist = ({
  title,
  subtitle,
  onPressSeeMore,
  onEndReached,
  onViewableItemsChanged,
  titleSeeMoreLink,
  data,
  itemHeight,
  itemWidth,
  renderItem,
  renderFooter,
  playlistType,
  tileType,
  keyExtractor,
  playlistRef,
  testID: _testID,
  noMarginBottom,
  FlatListComponent,
  withMargin = true,
  ...props
}: Props) => {
  const { isTouch } = useTheme()

  const showTitleSeeMore = !!onPressSeeMore && !isTouch
  const showFooterSeeMore = !!onPressSeeMore && isTouch

  type SizeProps = {
    width: number
    height: number
  }

  const defaultRenderFooter: RenderFooterItem = useCallback(
    ({ width, height }: SizeProps) => (
      <SeeMore width={width} height={height} onPress={onPressSeeMore as () => void} />
    ),
    [onPressSeeMore]
  )

  function renderTitleSeeMore() {
    return showTitleSeeMore && !!titleSeeMoreLink && !!onPressSeeMore ? (
      <SeeMoreWithEye
        title={title}
        titleSeeMoreLink={titleSeeMoreLink}
        onPressSeeMore={onPressSeeMore}
      />
    ) : null
  }
  return (
    <StyledViewGap gap={4} noMarginBottom={noMarginBottom} {...props}>
      <ViewGap gap={1}>
        <StyledView>
          <AccessibleTitle
            withMargin={withMargin}
            TitleComponent={TitleLevel2}
            testID="playlistTitle"
            title={title}
          />
          {renderTitleSeeMore()}
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
        renderFooter={showFooterSeeMore ? renderFooter || defaultRenderFooter : undefined}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        playlistType={playlistType}
        tileType={tileType}
        ref={playlistRef}
        onViewableItemsChanged={onViewableItemsChanged}
        FlatListComponent={FlatListComponent}
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
