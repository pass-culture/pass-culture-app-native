import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse } from 'api/gen'
import { FavoriteActions } from 'features/favorites/components/FavoriteActions'
import { FavoriteAnimatedWrapper } from 'features/favorites/components/FavoriteAnimatedWrapper'
import { FavoriteBookingButton } from 'features/favorites/components/FavoriteBookingButton'
import { getBookingButtonProperties } from 'features/favorites/helpers/getBookingButtonProperties'
import { getFavoriteDisplayPrice } from 'features/favorites/helpers/getFavoriteDisplayPrice'
import { useFavoriteFormattedDate } from 'features/favorites/hooks/useFavoriteFormattedDate'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { UserProfile } from 'features/share/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { getDistance } from 'libs/location/getDistance'
import { useUserLocation, usePlace, useLocationMode } from 'libs/locationV2/location.store'
import { useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { useRemoveFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useModal } from 'ui/components/modals/useModal'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Typo } from 'ui/theme'

interface FavoriteProps {
  favorite: FavoriteResponse
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
  user: UserProfile
}

const SPACER_BETWEEN_IMAGE_AND_CONTENT = 4

export const FavoriteOffer: React.FC<FavoriteProps> = ({ favorite, onInAppBooking, user }) => {
  const { offer } = favorite
  const isAComingSoonOffer = getIsAComingSoonOffer(offer.bookingAllowedDatetime)
  const prePopulateOffer = usePrePopulateOffer()
  const userLocation = useUserLocation()
  const selectedPlace = usePlace()
  const selectedLocationMode = useLocationMode()
  const distanceToOffer = getDistance(
    {
      lat: offer.coordinates?.latitude,
      lng: offer.coordinates?.longitude,
    },
    { userLocation, selectedPlace, selectedLocationMode },
    offer.subcategoryId
  )
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  const displayPrice = getFavoriteDisplayPrice({
    currency,
    euroToPacificFrancRate,
    startPrice: offer.startPrice,
    price: offer.price,
  })
  const { categoryId, appLabel } = useSubcategory(offer.subcategoryId)
  const formattedDate = useFavoriteFormattedDate({ offer })
  const { modalToDisplay, ...bookingButtonProperties } =
    getBookingButtonProperties({
      offer,
      user: user,
      onInAppBooking: onInAppBooking,
    }) ?? {}

  const { OfferModal: BookOfferModal, showModal: showBookOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId: offer.id,
    from: StepperOrigin.FAVORITE,
  })

  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavoriteMutation({
    onError: () => {
      showErrorSnackBar('L’offre n’a pas été retirée de tes favoris')
    },
  })

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel: appLabel,
    distance: distanceToOffer,
    date: formattedDate,
    price: displayPrice,
  })

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    if (!offer.id) return
    prePopulateOffer({
      ...offer,
      categoryId,
      thumbUrl: offer.image?.url,
      name: offer.name,
      offerId: offer.id,
    })

    triggerConsultOfferLog({
      offerId: offer.id,
      from: 'favorites',
    })
  }

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { share: shareOffer, shareContent } = getShareOffer({
    offer,
    utmMedium: 'favorite',
  })

  const pressShareOffer = useCallback(() => {
    void analytics.logShare({ type: 'Offer', from: 'favorites', offerId: offer.id })
    void shareOffer()
    showShareOfferModal()
  }, [offer.id, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <FavoriteAnimatedWrapper onAnimationEnd={() => removeFavorite(favorite.id)}>
        {(triggerRemoveAnimation) => (
          <ViewGap gap={4}>
            <Container>
              <StyledTouchableLink
                navigateTo={{ screen: 'Offer', params: { id: offer.id, from: 'favorites' } }}
                onBeforeNavigate={handlePressOffer}
                accessibilityLabel={accessibilityLabel}>
                <Row gap={SPACER_BETWEEN_IMAGE_AND_CONTENT}>
                  <OfferImage imageUrl={offer.image?.url} categoryId={categoryId} />
                  <ContentContainer gap={4}>
                    <LeftContent>
                      <OfferName numberOfLines={2}>{offer.name}</OfferName>
                      <Body>{appLabel}</Body>
                      {formattedDate ? <Body>{formattedDate}</Body> : null}
                      {displayPrice ? <Price>{displayPrice}</Price> : null}
                    </LeftContent>
                    <RightContent>
                      {distanceToOffer ? <Distance>{distanceToOffer}</Distance> : null}
                    </RightContent>
                  </ContentContainer>
                </Row>
              </StyledTouchableLink>
            </Container>
            <FavoriteActions
              favorite={favorite}
              isRemoving={isRemoving}
              onRemove={triggerRemoveAnimation}
              onSharePress={pressShareOffer}
              shareAccessibilityLabel={`Partager l’offre ${offer.name}`}
              primaryAction={
                isAComingSoonOffer ? null : (
                  <FavoriteBookingButton
                    buttonProperties={bookingButtonProperties}
                    onOpenModal={showBookOfferModal}
                  />
                )
              }
            />
          </ViewGap>
        )}
      </FavoriteAnimatedWrapper>

      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
      {BookOfferModal}
    </React.Fragment>
  )
}

const Container = styled.View({
  position: 'relative',
})

const LeftContent = styled.View({
  flex: 1,
})

const RightContent = styled.View(({ theme }) => ({
  minWidth: theme.buttons.roundedButton.size,
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Row = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const ContentContainer = styled(ViewGap)({
  flexDirection: 'row',
  flex: 1,
})

const OfferName = styled(Typo.BodyAccent)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xs,
}))

const Distance = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'right',
  color: theme.designSystem.color.text.subtle,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Price = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
}))
