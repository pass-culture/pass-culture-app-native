import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { Color } from 'features/home/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { getOfferDates } from 'shared/date/getOfferDates'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { TypoDS, getShadow, getSpacing } from 'ui/theme'

type Props = {
  offer: Offer
  color: Color
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
  style?: StyleProp<ViewStyle>
}

export const VideoMonoOfferTile: FunctionComponent<Props> = ({
  offer,
  color,
  hideModal,
  analyticsParams,
  style,
}) => {
  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const labelMapping = useCategoryHomeLabelMapping()
  const mapping = useCategoryIdMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const theme = useTheme()

  const displayDate = getOfferDates(
    offer.offer.subcategoryId,
    offer.offer.dates,
    offer.offer.releaseDate
  )

  const displayPrice = getDisplayedPrice(
    offer?.offer?.prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(offer.offer.subcategoryId),
      isDuo: !!(offer.offer.isDuo && user?.isBeneficiary),
    })
  )

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
      triggerConsultOfferLog({
        offerId: +offer.objectID,
        ...analyticsParams,
      })
    },
  }

  return enableMultiVideoModule ? (
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
          <CategoryText colorText={color}>{labelMapping[offer.offer.subcategoryId]}</CategoryText>
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

const CategoryText = styled(TypoDS.BodyAccentXs)<{ colorText: Color }>(({ colorText }) => ({
  color: getTagColor(colorText),
  marginBottom: getSpacing(1),
}))

const TitleText = styled(TypoDS.BodyAccent)({
  marginBottom: getSpacing(1),
})

const AdditionalInfoText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
  marginBottom: getSpacing(1),
}))
