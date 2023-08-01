import React, { memo, useState } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { BlackCaption } from 'features/home/components/BlackCaption'
import { getGradientColors } from 'features/home/components/helpers/getGradientColors'
import { HighlightOfferModule as HighlightOfferModuleProps } from 'features/home/types'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const OFFER_IMAGE_HEIGHT = getSpacing(45)
const BOTTOM_SPACER = getSpacing(6)
const DESKTOP_OFFER_IMAGE_WIDTH = getSpacing(81)
const DESKTOP_COLOR_BACKGROUND_HEIGHT = getSpacing(45)

const getColorBackgroundHeight = (offerDetailsHeight: number) => {
  return OFFER_IMAGE_HEIGHT / 2 + offerDetailsHeight + BOTTOM_SPACER
}

const UnmemoizedHighlightOfferModule = (props: HighlightOfferModuleProps) => {
  const highlightOffer = useHighlightOffer(props.id, props.offerId)
  const [offerDetailsHeight, setOfferDetailsHeight] = useState(0)
  const categoryLabelMapping = useCategoryHomeLabelMapping()
  const categoryIdMapping = useCategoryIdMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const { isDesktopViewport } = useTheme()

  if (!highlightOffer) return null
  const { offer, venue, objectID: offerId } = highlightOffer

  const timestampsInMillis = offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const formattedDate = formatDates(timestampsInMillis)
  const formattedPrice = getDisplayPrice(offer?.prices)
  const venueName = venue.name
  const categoryLabel = categoryLabelMapping[offer.subcategoryId]
  const categoryId = categoryIdMapping[offer.subcategoryId]

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitle>{props.highlightTitle}</StyledTitle>
      </StyledTitleContainer>
      <Spacer.Column numberOfSpaces={5} />
      <View>
        <ColorCategoryBackground
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={getGradientColors(props.color)}
          height={
            isDesktopViewport
              ? DESKTOP_COLOR_BACKGROUND_HEIGHT
              : getColorBackgroundHeight(offerDetailsHeight)
          }
        />
        <StyledTouchableLink
          testID="highlight-offer-image"
          accessibilityRole="button"
          highlight
          navigateTo={{
            screen: 'Offer',
            params: { id: offerId },
          }}
          onBeforeNavigate={() => {
            prePopulateOffer({
              ...offer,
              offerId: +offerId,
              categoryId,
            })
          }}>
          <TouchableContent>
            <OfferImage source={{ uri: props.image }}>
              {!!categoryLabel && <CategoryCaption label={categoryLabel} />}
            </OfferImage>
            <OfferDetails
              onLayout={(event) => setOfferDetailsHeight(event.nativeEvent.layout.height)}>
              <StyledOfferTitle>{props.offerTitle}</StyledOfferTitle>
              {!!formattedDate && <AdditionalDetail>{formattedDate}</AdditionalDetail>}
              {!!venueName && <AdditionalDetail>{venueName}</AdditionalDetail>}
              {!!formattedPrice && <AdditionalDetail>{formattedPrice}</AdditionalDetail>}
            </OfferDetails>
            <ArrowOffer>
              <PlainArrowNext />
            </ArrowOffer>
          </TouchableContent>
        </StyledTouchableLink>
        <Spacer.Column numberOfSpaces={6} />
      </View>
    </Container>
  )
}

export const HighlightOfferModule = memo(UnmemoizedHighlightOfferModule)

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledTitle = styled(Typo.Title3).attrs({
  numberOfLines: 2,
})``

const ColorCategoryBackground = styled(LinearGradient)<{
  height: number
}>(({ height }) => ({
  position: 'absolute',
  right: 0,
  left: 0,
  bottom: 0,
  height: height,
}))

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const TouchableContent = styled.View(({ theme }) => ({
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
}))

const getOfferImageDesktopStyle = (theme: DefaultTheme) => ({
  width: DESKTOP_OFFER_IMAGE_WIDTH,
  borderTopLeftRadius: theme.borderRadius.radius,
  borderBottomLeftRadius: theme.borderRadius.radius,
  borderRightWidth: 0,
})

const getOfferImageMobileStyle = (theme: DefaultTheme) => ({
  borderTopLeftRadius: theme.borderRadius.radius,
  borderTopRightRadius: theme.borderRadius.radius,
  borderBottomWidth: 0,
})

const OfferImage = styled.ImageBackground(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  height: OFFER_IMAGE_HEIGHT,
  border: 1,
  borderColor: theme.colors.greyMedium,
  ...(theme.isDesktopViewport ? getOfferImageDesktopStyle(theme) : getOfferImageMobileStyle(theme)),
}))

const getOfferDetailsDesktopStyle = (theme: DefaultTheme) => ({
  borderTopRightRadius: theme.borderRadius.radius,
  borderBottomRightRadius: theme.borderRadius.radius,
  borderLeftWidth: 0,
  flex: 'auto',
  justifyContent: 'center',
})

const getOfferDetailsMobileStyle = (theme: DefaultTheme) => ({
  borderBottomLeftRadius: theme.borderRadius.radius,
  borderBottomRightRadius: theme.borderRadius.radius,
  borderTopWidth: 0,
})

const OfferDetails = styled.View(({ theme }) => ({
  background: theme.colors.white,
  padding: getSpacing(4),
  border: 1,
  borderColor: theme.colors.greyMedium,
  ...(theme.isDesktopViewport
    ? getOfferDetailsDesktopStyle(theme)
    : getOfferDetailsMobileStyle(theme)),
}))

const StyledOfferTitle = styled(Typo.ButtonText)``

const AdditionalDetail = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  marginTop: getSpacing(1),
}))

const ArrowOffer = styled.View({
  position: 'absolute',
  bottom: getSpacing(4),
  right: getSpacing(4),
})

const CategoryCaption = styled(BlackCaption)({
  position: 'absolute',
  bottom: getSpacing(2),
  left: getSpacing(2),
})
