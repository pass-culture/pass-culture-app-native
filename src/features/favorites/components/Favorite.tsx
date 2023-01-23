import React, { useCallback, useRef } from 'react'
import { Animated } from 'react-native'
import { useQueryClient } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse, UserProfileResponse } from 'api/gen'
import { useRemoveFavorite } from 'features/favorites/api'
import { BookingButton } from 'features/favorites/components/Buttons/BookingButton'
import { getFavoriteDisplayPrice } from 'features/favorites/helpers/getFavoriteDisplayPrice'
import { useFavoriteFormattedDate } from 'features/favorites/helpers/useFavoriteFormattedDate'
import { mergeOfferData } from 'features/offer/components/OfferTile/OfferTile'
import { useShareOffer } from 'features/share/helpers/useShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/firebase/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { QueryKeys } from 'libs/queryKeys'
import { useSearchGroupLabel, useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { useElementHeight } from 'ui/hooks/useElementHeight'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  favorite: FavoriteResponse
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
  user: UserProfileResponse
}

export const Favorite: React.FC<Props> = (props) => {
  const { offer } = props.favorite
  const theme = useTheme()
  const { onLayout, height } = useElementHeight()
  const animatedOpacity = useRef(new Animated.Value(1)).current
  const animatedCollapse = useRef(new Animated.Value(1)).current
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance({
    lat: offer.coordinates?.latitude,
    lng: offer.coordinates?.longitude,
  })
  const displayPrice = getFavoriteDisplayPrice({ startPrice: offer.startPrice, price: offer.price })
  const { showErrorSnackBar } = useSnackBarContext()
  const { categoryId, searchGroupName } = useSubcategory(offer.subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)
  const formattedDate = useFavoriteFormattedDate({ offer })

  const { mutate: removeFavorite, isLoading } = useRemoveFavorite({
    onError: () => {
      showErrorSnackBar({
        message: "L'offre n'a pas été retirée de tes favoris",
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel: searchGroupLabel,
    distance: distanceToOffer,
    date: formattedDate,
    price: displayPrice,
  })

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    if (!offer.id) return
    queryClient.setQueryData(
      [QueryKeys.OFFER, offer.id],
      mergeOfferData({
        ...offer,
        categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })
    )
    analytics.logConsultOffer({ offerId: offer.id, from: 'favorites' })
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

  const { shareOffer, shareContent } = useShareOffer(offer.id)

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'favorites', id: offer.id })
    shareOffer()
    showShareOfferModal()
  }, [offer.id, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <Animated.View onLayout={onLayout} style={animatedViewStyle}>
        <Container>
          <StyledTouchableLink
            navigateTo={
              offer.id
                ? { screen: 'Offer', params: { id: offer.id, from: 'favorites' } }
                : undefined
            }
            onBeforeNavigate={handlePressOffer}
            accessibilityLabel={accessibilityLabel}>
            <Row>
              <OfferImage imageUrl={offer.image?.url} categoryId={categoryId} />
              <Spacer.Row numberOfSpaces={4} />
              <ContentContainer>
                <LeftContent>
                  <Typo.ButtonText numberOfLines={2}>{offer.name}</Typo.ButtonText>
                  <Spacer.Column numberOfSpaces={1} />
                  <Body>{searchGroupLabel}</Body>
                  {!!formattedDate && <Body>{formattedDate}</Body>}
                  {!!displayPrice && (
                    <React.Fragment>
                      <Spacer.Column numberOfSpaces={1} />
                      <Typo.Caption>{displayPrice}</Typo.Caption>
                    </React.Fragment>
                  )}
                </LeftContent>
                <Spacer.Row numberOfSpaces={2} />
                <RightContent>
                  {!!distanceToOffer && <Distance>{distanceToOffer}</Distance>}
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
        <ButtonsRow>
          <ButtonContainer>
            <ButtonSecondary
              wording="Supprimer"
              accessibilityLabel={`Supprimer l'offre ${offer.name} de mes favoris`}
              onPress={onRemove}
              buttonHeight="tall"
              disabled={isLoading}
            />
          </ButtonContainer>
          {!theme.isMobileViewport && <Spacer.Flex flex={1 / 30} />}
          <ButtonContainer>
            <BookingButton offer={offer} user={props.user} onInAppBooking={props.onInAppBooking} />
          </ButtonContainer>
        </ButtonsRow>
        <Separator />
      </Animated.View>
      {!!shareContent && (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l'offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      )}
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

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const ContentContainer = styled.View({
  flexDirection: 'row',
  flex: 1,
})

const ButtonContainer = styled.View({
  maxWidth: getSpacing(70),
  width: '47%',
})

const ButtonsRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: theme.isMobileViewport ? 'space-between' : 'center',
  marginTop: getSpacing(6),
  marginHorizontal: getSpacing(6),
}))

const Distance = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'right',
  color: theme.colors.greyDark,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))
