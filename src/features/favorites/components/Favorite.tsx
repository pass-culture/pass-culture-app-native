import React, { useCallback, useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse, UserProfileResponse } from 'api/gen'
import { getBookingButtonProperties } from 'features/favorites/helpers/getBookingButtonProperties'
import { getFavoriteDisplayPrice } from 'features/favorites/helpers/getFavoriteDisplayPrice'
import { useFavoriteFormattedDate } from 'features/favorites/hooks/useFavoriteFormattedDate'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { useRemoveFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { LineSeparator } from 'ui/components/LineSeparator'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useLayout } from 'ui/hooks/useLayout'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  favorite: FavoriteResponse
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
  user: UserProfileResponse
}

const SPACER_BETWEEN_IMAGE_AND_CONTENT = 4

export const Favorite: React.FC<Props> = (props) => {
  const { offer } = props.favorite
  const { onLayout, height } = useLayout()
  const animatedOpacity = useRef(new Animated.Value(1)).current
  const animatedCollapse = useRef(new Animated.Value(1)).current
  const prePopulateOffer = usePrePopulateOffer()
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const distanceToOffer = getDistance(
    {
      lat: offer.coordinates?.latitude,
      lng: offer.coordinates?.longitude,
    },
    { userLocation, selectedPlace, selectedLocationMode }
  )
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const displayPrice = getFavoriteDisplayPrice({
    currency,
    euroToPacificFrancRate,
    startPrice: offer.startPrice,
    price: offer.price,
  })
  const { showErrorSnackBar } = useSnackBarContext()
  const { categoryId, appLabel } = useSubcategory(offer.subcategoryId)
  const formattedDate = useFavoriteFormattedDate({ offer })
  const { modalToDisplay, ...buttonProperties } =
    getBookingButtonProperties({
      offer,
      user: props.user,
      onInAppBooking: props.onInAppBooking,
    }) ?? {}

  const { OfferModal: BookOfferModal, showModal: showBookOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId: offer.id,
    from: StepperOrigin.FAVORITE,
  })

  const { mutate: removeFavorite, isLoading } = useRemoveFavoriteMutation({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
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

    triggerConsultOfferLog({ offerId: offer.id, from: 'favorites' })
  }

  function onRemove() {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 0,
        delay: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedCollapse, {
        toValue: 0,
        delay: 100,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      removeFavorite(props.favorite.id)
    })
  }

  const animatedViewStyle = {
    opacity: animatedOpacity,
    height: height
      ? animatedCollapse.interpolate({
          inputRange: [0, 1],
          outputRange: [0, height],
        })
      : undefined,
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
    analytics.logShare({ type: 'Offer', from: 'favorites', offerId: offer.id })
    shareOffer()
    showShareOfferModal()
  }, [offer.id, shareOffer, showShareOfferModal])

  const BookingButton = useMemo(() => {
    const { wording, externalNav, disabled, accessibilityLabel } = buttonProperties
    if (!wording) return
    if (externalNav)
      return (
        <ExternalTouchableLink
          externalNav={externalNav}
          wording={wording}
          accessibilityLabel={accessibilityLabel}
          as={ButtonPrimary}
          icon={ExternalSite}
          buttonHeight="tall"
        />
      )
    const onPressBookingButton = () => {
      buttonProperties?.onPress?.()
      showBookOfferModal()
    }
    return (
      <ButtonPrimary
        wording={wording}
        disabled={disabled}
        onPress={onPressBookingButton}
        buttonHeight="tall"
      />
    )
  }, [buttonProperties, showBookOfferModal])

  return (
    <React.Fragment>
      <Animated.View onLayout={onLayout} style={animatedViewStyle}>
        <Container>
          <StyledTouchableLink
            navigateTo={{ screen: 'Offer', params: { id: offer.id, from: 'favorites' } }}
            onBeforeNavigate={handlePressOffer}
            accessibilityLabel={accessibilityLabel}>
            <Row gap={SPACER_BETWEEN_IMAGE_AND_CONTENT}>
              <OfferImage imageUrl={offer.image?.url} categoryId={categoryId} />
              <ContentContainer gap={2}>
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
          <ShareContainer>
            <RoundedButton
              iconName="share"
              onPress={pressShareOffer}
              accessibilityLabel={`Partager l’offre ${offer.name}`}
            />
          </ShareContainer>
        </Container>
        <FavoriteButtonsContainer gap={5}>
          <ButtonContainer>
            <ButtonSecondary
              wording="Supprimer"
              accessibilityLabel={`Supprimer l’offre ${offer.name} de mes favoris`}
              onPress={onRemove}
              buttonHeight="tall"
              disabled={isLoading}
            />
          </ButtonContainer>
          <ButtonContainer>{BookingButton}</ButtonContainer>
        </FavoriteButtonsContainer>
        <LineSeparator />
      </Animated.View>
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

const ShareContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  marginRight: theme.contentPage.marginHorizontal,
}))

const LeftContent = styled.View({
  flex: 1,
})

const RightContent = styled.View(({ theme }) => ({
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
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

const ButtonContainer = styled.View({
  maxWidth: getSpacing(70),
  flex: 1,
})

const DEFAULT_MARGIN = getSpacing(6)
export const FavoriteButtonsContainer = styled(ViewGap)(({ theme }) => {
  const WEB_MARGIN_LEFT =
    DEFAULT_MARGIN + theme.tiles.sizes.small.width + getSpacing(SPACER_BETWEEN_IMAGE_AND_CONTENT)
  return {
    flexDirection: 'row',
    marginTop: DEFAULT_MARGIN,
    marginRight: DEFAULT_MARGIN,
    marginLeft: theme.isMobileViewport ? DEFAULT_MARGIN : WEB_MARGIN_LEFT,
  }
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
