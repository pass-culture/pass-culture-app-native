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
<<<<<<< HEAD
import { formatDates } from 'libs/parsers/formatDates'
import { useGetDisplayPrice } from 'libs/parsers/getDisplayPrice'
=======
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
>>>>>>> 54c757a09 (feat: use new hook and new component to render properly formatted dates)
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useOfferDates } from 'shared/hook/useOfferDates'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, Typo, getSpacing } from 'ui/theme'

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
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()
  const { user } = useAuthContext()

  const displayPrice = useGetDisplayPrice(offer?.offer?.prices)

  const displayDate = useOfferDates(offer)

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
