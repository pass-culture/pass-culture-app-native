// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  ArtistPlaylistModule as ArtistPlaylistModuleType,
  Color,
  ModuleData,
} from 'features/home/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import {
  useMobileFontScaleToDisplay,
  useNumberOfLine,
} from 'shared/accessibility/helpers/zoomHelpers'
import {
  CategoryButtonIllustrationName,
  categoryButtonIllustrationUrls,
} from 'shared/illustrations/categoryButtonIllustrations'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'
import { colorMapping } from 'ui/theme/colorMapping'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

export type ArtistEditorialModuleProps = {
  title: string
  moduleId: string
  data: ModuleData | undefined
  color: Color
  illustration: CategoryButtonIllustrationName
  offersModuleParameters: ArtistPlaylistModuleType['offersModuleParameters']
}

const FIXED_SIZE_DESKTOP = getSpacing(46)
const FIXED_SIZE_MOBILE = getSpacing(52)
const RATIO = 3 / 2
const NUMBER_OF_ITEMS = 3
const MAX_WIDTH_DESKTOP_OFFERS_CONTAINER = 512
const RIGHT_MOBILE_STICKER = -getSpacing(19)
const MARGIN_TOP_OFFERS_CONTAINER_MOBILE = -getSpacing(22)
const MARGIN_TOP_OFFERS_CONTAINER_DESKTOP = -getSpacing(42)

export const ArtistEditorialModule: FunctionComponent<ArtistEditorialModuleProps> = ({
  title,
  moduleId,
  data,
  color,
  illustration,
}) => {
  const theme = useTheme()
  const { isDesktopViewport, designSystem } = theme
  const numberOfLines = useNumberOfLine(2)
  const isZoomedAt200 = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const items = data?.playlistItems ?? []

  const gapInPx = designSystem.size.spacing.l
  const totalGapsWidth = gapInPx * (NUMBER_OF_ITEMS - 1)

  const desktopWidth =
    containerWidth > 0
      ? Math.min(containerWidth, MAX_WIDTH_DESKTOP_OFFERS_CONTAINER)
      : MAX_WIDTH_DESKTOP_OFFERS_CONTAINER

  const effectiveContainerWidth = isDesktopViewport
    ? desktopWidth
    : containerWidth - designSystem.size.spacing.l

  const availableWidth = effectiveContainerWidth - totalGapsWidth
  const itemWidth = availableWidth > 0 ? Math.floor(availableWidth / NUMBER_OF_ITEMS) : 0
  const itemHeight = Math.floor(itemWidth * RATIO)

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width)
  }

  const headerHeight = isDesktopViewport ? FIXED_SIZE_DESKTOP : FIXED_SIZE_MOBILE
  const OffersContainer = isDesktopViewport ? DesktopOffersContainer : MobileOffersContainer

  return (
    <Container
      onLayout={handleLayout}
      testID={isDesktopViewport ? 'desktopArtistEditorial' : 'mobileArtistEditorial'}>
      <HeaderCard color={color} minHeight={headerHeight}>
        <TitleText {...setTextSemantic('h2')} numberOfLines={numberOfLines}>
          {title}
        </TitleText>
        <Sticker
          source={{ uri: categoryButtonIllustrationUrls[illustration] }}
          resizeMode="contain"
        />
      </HeaderCard>

      {items.length > 0 ? (
        <OffersContainer gap={4} isZoomedAt200={isZoomedAt200}>
          {items.slice(0, NUMBER_OF_ITEMS).map((item) => (
            <OfferTileWrapper
              key={item.id}
              item={item}
              moduleId={moduleId}
              originDetails="artistEditorial"
              width={itemWidth}
              height={itemHeight}
              analyticsFrom="artist"
              hasSmallLayout
            />
          ))}
        </OffersContainer>
      ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  position: 'relative',
}))

const HeaderCard = styled.View<{
  color: Color
  minHeight: number
}>(({ theme, color, minHeight }) => ({
  borderRadius: theme.designSystem.size.borderRadius.l,
  backgroundColor: theme.designSystem.color.illustration[colorMapping[color].fill],
  minHeight,
  overflow: 'hidden',
  position: 'relative',
}))

const TitleText = styled(Typo.Title3)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.xl,
  marginLeft: theme.isDesktopViewport
    ? theme.designSystem.size.spacing.xl
    : theme.designSystem.size.spacing.l,
  maxWidth: theme.isDesktopViewport ? '20%' : '60%',
}))

const Sticker = styled(FastImage)(({ theme }) => ({
  position: 'absolute',
  top: theme.isDesktopViewport
    ? -theme.designSystem.size.spacing.xxl
    : -theme.designSystem.size.spacing.xxxxl,
  right: theme.isDesktopViewport ? -theme.designSystem.size.spacing.xl : RIGHT_MOBILE_STICKER,
  width: theme.designSystem.size.illustration.xl,
  height: theme.designSystem.size.illustration.xl,
}))

const MobileOffersContainer = styled(ViewGap)<{ isZoomedAt200: boolean }>(
  ({ theme, isZoomedAt200 }) => ({
    flexDirection: 'row',
    marginTop: isZoomedAt200
      ? theme.designSystem.size.spacing.m
      : MARGIN_TOP_OFFERS_CONTAINER_MOBILE,
    paddingHorizontal: theme.designSystem.size.spacing.s,
  })
)

const DesktopOffersContainer = styled(ViewGap)({
  flexDirection: 'row',
  maxWidth: MAX_WIDTH_DESKTOP_OFFERS_CONTAINER,
  alignSelf: 'center',
  marginTop: MARGIN_TOP_OFFERS_CONTAINER_DESKTOP,
})
