import React, { ComponentProps, ComponentType, Ref, useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

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
  title: string
  subtitle?: string
  TitleComponent?: ComponentType<ComponentProps<typeof DefaultTitle>>
  onPressSeeMore?: () => void
  renderFooter?: RenderFooterItem
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
  playlistRef?: Ref<FlatList>
}

export const PassPlaylist = ({
  title,
  subtitle,
  TitleComponent,
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
  ...props
}: Props) => {
  const { isTouch } = useTheme()

  const showTitleSeeMore = !!onPressSeeMore && !isTouch
  const showFooterSeeMore = !!onPressSeeMore && isTouch

  const StyledTitleComponent = styled(TitleComponent || DefaultTitle).attrs({
    numberOfLines: 2,
  })(({ theme }) => ({
    marginHorizontal: theme.contentPage.marginHorizontal,
  }))

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
    <Container gap={4} {...props}>
      <ViewGap gap={1}>
        <StyledView>
          <StyledTitleComponent testID="playlistTitle">{title}</StyledTitleComponent>
          {renderTitleSeeMore()}
        </StyledView>
        {subtitle ? <StyledSubtitle>{subtitle}</StyledSubtitle> : null}
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
      />
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const DefaultTitle = styled(Typo.Title3).attrs(getHeadingAttrs(2))``

const StyledSubtitle = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  color: theme.colors.greyDark,
}))

const StyledView = styled.View({
  flexDirection: 'row',
})
