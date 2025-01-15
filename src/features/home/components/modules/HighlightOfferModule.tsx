import { parseInt } from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { BlackCaption } from 'features/home/components/BlackCaption'
import { HighlightOfferModule as HighlightOfferModuleType } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { ContentTypes } from 'libs/contentful/types'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { theme } from 'theme'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo, TypoDS, getSpacing } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

import { MarketingBlockExclusivity } from './marketing/MarketingBlockExclusivity'

const OFFER_IMAGE_HEIGHT = getSpacing(45)
const BOTTOM_SPACER = getSpacing(6)
const DESKTOP_OFFER_IMAGE_WIDTH = getSpacing(81)
const DESKTOP_COLOR_BACKGROUND_HEIGHT = getSpacing(45)

const getColorBackgroundHeight = (offerDetailsHeight: number) => {
  return OFFER_IMAGE_HEIGHT / 2 + offerDetailsHeight + BOTTOM_SPACER
}

type HighlightOfferModuleProps = HighlightOfferModuleType & {
  index: number
  homeEntryId: string | undefined
}

const UnmemoizedHighlightOfferModule = (props: HighlightOfferModuleProps) => {
  const {
    id,
    offerId,
    offerEan,
    offerTag,
    isGeolocated,
    aroundRadius,
    index,
    homeEntryId,
    displayPublicationDate,
  } = props

  const highlightOffer = useHighlightOffer({
    id,
    offerId,
    offerEan,
    offerTag,
    isGeolocated,
    aroundRadius,
  })

  const [offerDetailsHeight, setOfferDetailsHeight] = useState(0)
  const { user } = useAuthContext()
  const categoryLabelMapping = useCategoryHomeLabelMapping()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const categoryIdMapping = useCategoryIdMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const { isDesktopViewport } = useTheme()
  const isNewExclusivityModule = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_EXCLUSIVITY_MODULE)

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.HIGHLIGHT_OFFER,
      index,
      homeEntryId,
      offers: offerId ? [offerId] : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!highlightOffer) return null
  const {
    offer,
    venue: { publicName, name },
    objectID: highlightOfferId,
  } = highlightOffer

  const timestampsInMillis = offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const formattedDate = formatDates(timestampsInMillis)
  const formattedPrice = getDisplayedPrice(
    offer.prices,
    currency,
    euroToPacificFrancRate,
    offer.isDuo && user?.isBeneficiary
  )
  const venueName = publicName?.length ? publicName : name
  const categoryLabel = categoryLabelMapping[offer.subcategoryId]
  const categoryId = categoryIdMapping[offer.subcategoryId]

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitle>{props.highlightTitle}</StyledTitle>
      </StyledTitleContainer>
      <Spacer.Column numberOfSpaces={5} />
      {isNewExclusivityModule ? (
        <MarketingBlockExclusivity
          offer={highlightOffer}
          homeEntryId={homeEntryId}
          backgroundImageUrl={props.image}
          moduleId={props.id}
          shouldDisplayPublicationDate={displayPublicationDate}
        />
      ) : (
        <View>
          <ColorCategoryBackground
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={gradientColorsMapping[props.color]}
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
              params: { id: highlightOfferId },
            }}
            onBeforeNavigate={() => {
              prePopulateOffer({
                ...offer,
                offerId: +highlightOfferId,
                categoryId,
              })
              triggerConsultOfferLog({
                offerId: +highlightOfferId,
                from: 'highlightOffer',
                moduleId: props.id,
                moduleName: props.highlightTitle,
                homeEntryId: props.homeEntryId,
              })
            }}>
            <TouchableContent>
              <OfferImage source={{ uri: props.image }}>
                {categoryLabel ? <CategoryCaption label={categoryLabel} /> : null}
              </OfferImage>
              <OfferDetails
                onLayout={(event: LayoutChangeEvent) =>
                  setOfferDetailsHeight(event.nativeEvent.layout.height)
                }>
                <StyledOfferTitle>{props.offerTitle}</StyledOfferTitle>
                {formattedDate ? <AdditionalDetail>{formattedDate}</AdditionalDetail> : null}
                {venueName ? <AdditionalDetail>{venueName}</AdditionalDetail> : null}
                {formattedPrice ? <AdditionalDetail>{formattedPrice}</AdditionalDetail> : null}
              </OfferDetails>
              <ArrowOffer>
                <PlainArrowNext size={theme.icons.sizes.small} />
              </ArrowOffer>
            </TouchableContent>
          </StyledTouchableLink>
          <FavoriteButtonContainer>
            <FavoriteButton
              offerId={parseInt(highlightOfferId)}
              analyticsParams={{
                from: 'highlightOffer',
                moduleId: props.id,
                moduleName: props.highlightTitle,
              }}
            />
          </FavoriteButtonContainer>
          <Spacer.Column numberOfSpaces={6} />
        </View>
      )}
    </Container>
  )
}

export const HighlightOfferModule = memo(UnmemoizedHighlightOfferModule)

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const FavoriteButtonContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.isDesktopViewport ? getSpacing(4) : getSpacing(2),
  right: theme.isDesktopViewport
    ? theme.contentPage.marginHorizontal + getSpacing(4)
    : theme.contentPage.marginHorizontal + getSpacing(2),
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledTitle = styled(TypoDS.Title3).attrs({
  numberOfLines: 2,
})``

const ColorCategoryBackground = styled(LinearGradient)<{
  height: number
}>(({ height }) => ({
  position: 'absolute',
  right: 0,
  left: 0,
  bottom: 0,
  height,
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
  backgroundColor: theme.colors.greyLight,
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

const AdditionalDetail = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
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
