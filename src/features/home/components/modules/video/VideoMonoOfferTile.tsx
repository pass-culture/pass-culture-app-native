import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getShadow, getSpacing, Typo } from 'ui/theme'
import { useGetEuroToXPFRate } from 'libs/parsers/useGetEuroToXPFRate'
import { useGetCurrentCurrency } from 'libs/parsers/useGetCurrentCurrency'

type Props = {
  offer: Offer
  color: string
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
  homeEntryId: string
  style?: StyleProp<ViewStyle>
}

export const VideoMonoOfferTile: FunctionComponent<Props> = ({
  offer,
  color,
  hideModal,
  analyticsParams,
  homeEntryId,
  style,
}) => {
  const currency = useGetCurrentCurrency()
  const euroToXPFRate = useGetEuroToXPFRate()

  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableMultiVideoModule,
    homeId: homeEntryId,
  })
  const labelMapping = useCategoryHomeLabelMapping()
  const mapping = useCategoryIdMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const theme = useTheme()

  const timestampsInMillis = offer.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const displayDate = formatDates(timestampsInMillis)

  const displayPrice = getDisplayPrice(offer?.offer?.prices, currency, euroToXPFRate)

  const offerHeight = theme.isDesktopViewport ? getSpacing(45) : getSpacing(35)

  const categoryId = mapping[offer.offer.subcategoryId]

  const containerProps = {
    offerHeight,
    style,
    navigateTo: {
      screen: 'Offer',
      params: { id: +offer.objectID },
    },
    onBeforeNavigate: () => {
      hideModal()
      prePopulateOffer({
        ...offer.offer,
        offerId: +offer.objectID,
        categoryId,
      })
      analytics.logConsultOffer({
        offerId: +offer.objectID,
        ...analyticsParams,
      })
    },
  }

  return hasGraphicRedesign ? (
    <StyledInternalTouchableLink {...containerProps}>
      <AttachedOfferCard offer={offer} />
    </StyledInternalTouchableLink>
  ) : (
    <OfferInsert {...containerProps}>
      <Row>
        <OfferImageContainer>
          <OfferImage
            imageUrl={offer.offer.thumbUrl}
            categoryId={categoryId}
            size={theme.isDesktopViewport ? 'large' : 'medium'}
          />
        </OfferImageContainer>
        <OfferInformations>
          <CategoryText color={color}>{labelMapping[offer.offer.subcategoryId]}</CategoryText>
          <TitleText numberOfLines={2}>{offer.offer.name}</TitleText>
          {displayDate ? <AdditionalInfoText>{displayDate}</AdditionalInfoText> : null}
          {displayPrice ? <AdditionalInfoText>{displayPrice}</AdditionalInfoText> : null}
        </OfferInformations>
      </Row>
      <ArrowOffer>
        <PlainArrowNext size={theme.icons.sizes.small} />
      </ArrowOffer>
    </OfferInsert>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(12),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

const OfferInsert = styled(InternalTouchableLink)<{
  offerHeight: number
}>(({ theme, offerHeight }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  backgroundColor: theme.colors.white,
  height: offerHeight,
  alignItems: 'flex-start',
  border: 1,
  borderColor: theme.colors.greyMedium,
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const OfferInformations = styled.View({
  flex: 1,
  marginRight: getSpacing(4),
})

const OfferImageContainer = styled.View({
  margin: getSpacing(4),
})

const ArrowOffer = styled.View({
  position: 'absolute',
  bottom: getSpacing(4),
  right: getSpacing(4),
})

const CategoryText = styled(Typo.Caption)<{ color: string }>(({ color }) => ({
  color: getTagColor(color),
  marginBottom: getSpacing(1),
}))

const TitleText = styled(Typo.ButtonText)({
  marginBottom: getSpacing(1),
})

const AdditionalInfoText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  marginBottom: getSpacing(1),
}))
