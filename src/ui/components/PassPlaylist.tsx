import React, { ComponentProps, ComponentType, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Playlist, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
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
  | 'playlistType'
> & {
  title: string
  subtitle?: string
  TitleComponent?: ComponentType<ComponentProps<typeof DefaultTitle>>
  onPressSeeMore?: () => void
  renderFooter?: RenderFooterItem
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
}

export const PassPlaylist = (props: Props) => {
  const TitleComponent = props.TitleComponent || DefaultTitle

  const { isTouch } = useTheme()

  const showTitleSeeMore = !!props.onPressSeeMore && !isTouch
  const showFooterSeeMore = !!props.onPressSeeMore && isTouch

  const StyledTitleComponent = styled(TitleComponent).attrs({
    numberOfLines: 2,
  })({})

  type SizeProps = {
    width: number
    height: number
  }

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }: SizeProps) => (
      <SeeMore width={width} height={height} onPress={props.onPressSeeMore as () => void} />
    ),
    [props.onPressSeeMore]
  )

  function renderTitleSeeMore() {
    return showTitleSeeMore && !!props.titleSeeMoreLink && !!props.onPressSeeMore ? (
      <SeeMoreWithEye
        {...props}
        titleSeeMoreLink={props.titleSeeMoreLink}
        onPressSeeMore={props.onPressSeeMore}
      />
    ) : null
  }
  return (
    <Container>
      <TitleContainer>
        <Row>
          <StyledTitleComponent testID="playlistTitle">{props.title}</StyledTitleComponent>
          {renderTitleSeeMore()}
        </Row>
        {props.subtitle ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={1} />
            <StyledSubtitle>{props.subtitle}</StyledSubtitle>
          </React.Fragment>
        ) : null}
      </TitleContainer>
      <Spacer.Column numberOfSpaces={4} />
      <Playlist
        testID="offersModuleList"
        data={props.data}
        itemHeight={props.itemHeight}
        itemWidth={props.itemWidth}
        scrollButtonOffsetY={props.itemHeight / 2}
        renderItem={props.renderItem}
        renderFooter={showFooterSeeMore ? props.renderFooter || renderFooter : undefined}
        keyExtractor={props.keyExtractor}
        onEndReached={props.onEndReached}
        playlistType={props.playlistType}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})

const DefaultTitle = styled(Typo.Title3).attrs(getHeadingAttrs(2))``

const StyledSubtitle = styled(Typo.CaptionNeutralInfo).attrs({ numberOfLines: 2 })({
  marginHorizontal: getSpacing(6),
})

const TitleContainer = styled.View(({ theme }) => ({
  // The size of the title block should not exceed two lines of title and one of subtitle
  maxHeight:
    parseInt(theme.typography.title3.lineHeight) * 2 +
    getSpacing(1) +
    parseInt(theme.typography.caption.lineHeight),
  overflow: 'hidden',
}))
