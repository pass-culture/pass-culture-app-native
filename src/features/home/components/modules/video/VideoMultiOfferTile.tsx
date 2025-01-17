import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PlaylistCardOffer } from 'features/offer/components/OfferTile/PlaylistCardOffer'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { getOfferDates } from 'shared/date/getOfferDates'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

type Props = {
  offer: Offer
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
}

export const VideoMultiOfferTile: FunctionComponent<Props> = ({
  offer,
  hideModal,
  analyticsParams,
}) => {
  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const labelMapping = useCategoryHomeLabelMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()

  const displayPrice = getDisplayedPrice(
    offer?.offer?.prices,
    currency,
    euroToPacificFrancRate,
    offer.offer.isDuo && user?.isBeneficiary
  )

  const displayDate = getOfferDates(
    offer.offer.subcategoryId,
    offer.offer.dates,
    offer.offer.releaseDate
  )
  const displayDistance = useDistance(offer._geoloc)

  const categoryId = mapping[offer.offer.subcategoryId]

  const categoryLabel = labelMapping[offer.offer.subcategoryId]

  return (
    <Container>
      <StyledTouchableLink
        navigateTo={{
          screen: 'Offer',
          params: { id: +offer.objectID },
        }}
        onBeforeNavigate={() => {
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
        }}
        testId="multi-offer-tile">
        {enableMultiVideoModule ? (
          <PlaylistCardOffer
            categoryId={categoryId}
            thumbnailUrl={offer.offer.thumbUrl}
            distance={displayDistance}
            name={offer.offer.name}
            date={displayDate}
            price={displayPrice}
            categoryLabel={categoryLabel}
            width={getSpacing(26)}
            height={getSpacing(39)}
          />
        ) : (
          <React.Fragment>
            <OfferImage
              imageUrl={offer.offer.thumbUrl}
              categoryId={categoryId}
              size="large"
              borderRadius={getSpacing(2)}
              withStroke
            />
            <Spacer.Column numberOfSpaces={2} />
            <TypoDS.BodyAccentXs numberOfLines={1}>{offer.offer.name}</TypoDS.BodyAccentXs>
            <AdditionalInfoText>{labelMapping[offer.offer.subcategoryId]}</AdditionalInfoText>
            {displayPrice ? <AdditionalInfoText>{displayPrice}</AdditionalInfoText> : null}
          </React.Fragment>
        )}
      </StyledTouchableLink>
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(2),
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  width: theme.tiles.sizes['large'].width,
}))

const AdditionalInfoText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
