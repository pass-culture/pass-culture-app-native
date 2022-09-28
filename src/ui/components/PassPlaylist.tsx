import { t } from '@lingui/macro'
import React, { ComponentProps, ComponentType, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SeeMore } from 'features/home/atoms'
import { Cover } from 'features/home/atoms/Cover'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Playlist, RenderFooterItem, RenderHeaderItem } from 'ui/components/Playlist'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { EyeSophisticated as DefaultEyeSophisticated } from 'ui/svg/icons/EyeSophisticated'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = Pick<
  ComponentProps<typeof Playlist>,
  'data' | 'itemWidth' | 'itemHeight' | 'testID' | 'keyExtractor' | 'renderItem' | 'onEndReached'
> & {
  title: string
  subtitle?: string
  TitleComponent?: ComponentType<ComponentProps<typeof DefaultTitle>>
  onPressSeeMore?: () => void
  coverUrl?: string | null
  onDarkBackground?: boolean
  renderFooter?: RenderFooterItem
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
}

export const PassPlaylist = (props: Props) => {
  const TitleComponent = props.TitleComponent || DefaultTitle

  const { isTouch, colors } = useTheme()

  const showHeader = !!props.coverUrl
  const showTitleSeeMore = !!props.onPressSeeMore && !isTouch
  const showFooterSeeMore = !!props.onPressSeeMore && isTouch

  const titleSeparatorColor = props.onDarkBackground ? colors.white : colors.greyMedium
  const seeMoreColor = props.onDarkBackground ? colors.white : colors.primary

  const StyledTitleComponent = styled(TitleComponent).attrs({
    numberOfLines: 2,
  })<{ onDarkBackground?: boolean }>(({ onDarkBackground, theme }) => ({
    color: onDarkBackground ? theme.colors.white : theme.colors.black,
  }))

  const renderHeader: RenderHeaderItem = useCallback(
    ({ width, height }) => <Cover width={width} height={height} uri={props.coverUrl as string} />,
    [props.coverUrl]
  )
  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }) => (
      <SeeMore width={width} height={height} onPress={props.onPressSeeMore as () => void} />
    ),
    [props.onPressSeeMore]
  )

  function renderTitleSeeMore() {
    return showTitleSeeMore ? (
      <React.Fragment>
        <Spacer.Row numberOfSpaces={4} />
        <TitleSeparator color={titleSeparatorColor} />
        <Spacer.Row numberOfSpaces={3} />
        <StyledTouchableLink
          onDarkBackground={props.onDarkBackground}
          navigateTo={props.titleSeeMoreLink}
          onPress={props.onPressSeeMore}
          {...accessibilityAndTestId(t`Voir plus d’offres de la sélection` + ' ' + props.title)}>
          <EyeSophisticated color={seeMoreColor} />
          <Spacer.Row numberOfSpaces={2} />
          <ButtonText onDarkBackground={props.onDarkBackground}>{t`En voir plus`}</ButtonText>
        </StyledTouchableLink>
      </React.Fragment>
    ) : null
  }
  return (
    <Container>
      <TitleContainer>
        <Row>
          <StyledTitleComponent testID="playlistTitle" onDarkBackground={props.onDarkBackground}>
            {props.title}
          </StyledTitleComponent>
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
        renderHeader={showHeader ? renderHeader : undefined}
        renderFooter={showFooterSeeMore ? props.renderFooter || renderFooter : undefined}
        keyExtractor={props.keyExtractor}
        onEndReached={props.onEndReached}
      />
    </Container>
  )
}

const Container = styled.View({
  paddingBottom: getSpacing(6),
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})

const TitleSeparator = styled.View<{ color?: ColorsEnum }>((props) => ({
  width: 1,
  height: getSpacing(5),
  backgroundColor: props.color,
}))

const StyledTouchableLink = styled(TouchableLink).attrs<{ onDarkBackground?: boolean }>(
  ({ theme, onDarkBackground }) => ({
    hoverUnderlineColor: onDarkBackground ? theme.colors.white : theme.colors.primary,
  })
)({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(1),
})

const ButtonText = styled(Typo.ButtonText)<{ onDarkBackground?: boolean }>(
  ({ onDarkBackground, theme }) => ({
    color: onDarkBackground ? theme.colors.white : theme.colors.primary,
  })
)

const EyeSophisticated = styled(DefaultEyeSophisticated).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

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
