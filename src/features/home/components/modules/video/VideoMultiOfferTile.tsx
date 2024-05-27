import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { NewOfferTileContent } from 'features/offer/components/OfferTile/NewOfferTileContent'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { formatDates } from 'libs/parsers/formatDates'
import { formatDistance } from 'libs/parsers/formatDistance'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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

  const labelMapping = useCategoryHomeLabelMapping()
  const mapping = useCategoryIdMapping()
  const { userLocation } = useLocation()
  const { user } = useAuthContext()

  const displayPrice = getDisplayPrice(offer?.offer?.prices)

  const timestampsInMillis = offer.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const displayDate = formatDates(timestampsInMillis)
  const displayDistance = formatDistance(offer._geoloc, userLocation)
  const prePopulateOffer = usePrePopulateOffer()

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
          analytics.logConsultOffer({
            offerId: +offer.objectID,
            ...analyticsParams,
          })
        }}
        testId="multi-offer-tile">
        {enableMultiVideoModule ? (
          <NewOfferTileContent
            categoryId={categoryId}
            thumbnailUrl={offer.offer.thumbUrl}
            distance={displayDistance}
            name={offer.offer.name}
            date={displayDate}
            price={displayPrice}
            categoryLabel={categoryLabel}
            width={getSpacing(26)}
            height={getSpacing(39)}
            isBeneficiary={user?.isBeneficiary}
            isDuo={offer.offer.isDuo}
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
            <Typo.Caption numberOfLines={1}>{offer.offer.name}</Typo.Caption>
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

const AdditionalInfoText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
