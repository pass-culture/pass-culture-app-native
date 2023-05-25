import React, { useCallback, useEffect, useMemo } from 'react'
import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { OfferStockResponse, SubcategoryIdEnum } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { BookingInformations } from 'features/bookOffer/components/BookingInformations'
import { CancellationDetails } from 'features/bookOffer/components/CancellationDetails'
import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { RotatingTextOptions, useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { ANIMATION_DURATION } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGeolocation } from 'libs/geolocation'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InfoBanner } from 'ui/components/InfoBanner'
import { useModal } from 'ui/components/modals/useModal'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface BookingDetailsProps {
  stocks: OfferStockResponse[]
  onPressBookOffer: VoidFunction
  isLoading?: boolean
}

const LOADING_MESSAGES: RotatingTextOptions[] = [
  {
    message: 'En cours de confirmation...',
    keepDuration: 5000,
  },
  {
    message: 'Patiente quelques instants...',
    keepDuration: 5000,
  },
  {
    message: 'On y est presque...',
  },
]

export function BookingDetails({ stocks, onPressBookOffer, isLoading }: BookingDetailsProps) {
  const theme = useTheme()

  const { bookingState, dispatch } = useBookingContext()
  const selectedStock = useBookingStock()
  const offer = useBookingOffer()

  const isUserUnderage = useIsUserUnderage()
  const mapping = useSubcategoriesMapping()
  const { quantity } = bookingState
  const accessibilityDescribedBy = uuidv4()

  const isEvent = offer?.subcategoryId ? mapping[offer?.subcategoryId]?.isEvent : undefined

  const loadingMessage = useRotatingText(LOADING_MESSAGES, isLoading)

  const enableMultivenueOffer = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER)
  const isMultivenueCompatibleOffer = Boolean(
    offer?.subcategoryId === SubcategoryIdEnum.LIVRE_PAPIER ||
      offer?.subcategoryId === SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE
  )
  const shouldFetchSearchVenueOffers = Boolean(
    enableMultivenueOffer && isMultivenueCompatibleOffer && offer?.extraData?.isbn
  )

  const { onScroll: onScrollModal } = useOpacityTransition()
  const { userPosition: position } = useGeolocation()
  const { hasNextPage, fetchNextPage, refetch, data, venueList, isFetching, nbVenueItems } =
    useSearchVenueOffers({
      offerId: offer?.id ?? 0,
      venueId: offer?.venue?.id,
      geolocation: position ?? {
        latitude: offer?.venue?.coordinates?.latitude ?? 0,
        longitude: offer?.venue?.coordinates?.longitude ?? 0,
      },
      query: offer?.extraData?.isbn ?? '',
      queryOptions: { enabled: shouldFetchSearchVenueOffers },
    })
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)

  const shouldDisplayOtherVenuesAvailableButton = Boolean(
    shouldFetchSearchVenueOffers && nbVenueItems > 1
  )

  const venueName = offer?.venue.publicName ?? offer?.venue.name
  const venueFullAddress = formatFullAddressStartsWithPostalCode(
    offer?.venue.address,
    offer?.venue.postalCode,
    offer?.venue.city
  )

  const { visible, hideModal, showModal } = useModal(false)

  useEffect(() => {
    // For offers of type Thing, we don't manually select a date (thus a stock).
    // So we select it programmatically given the bookable stocks.
    const firstBookableStock = stocks.find(({ isBookable }) => isBookable)

    if (!selectedStock && firstBookableStock) {
      dispatch({ type: 'SELECT_STOCK', payload: firstBookableStock.id })
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks, selectedStock])

  // Change step to confirmation if no event offer
  useEffect(() => {
    if (!isEvent && bookingState.step === Step.DATE) {
      dispatch({ type: 'CHANGE_STEP', payload: Step.CONFIRMATION })
    }
  }, [bookingState.step, dispatch, isEvent])

  const venueSectionTitle = useMemo(() => {
    if (offer?.subcategoryId && isEvent !== undefined) {
      return getVenueSectionTitle(offer.subcategoryId, isEvent)
    }
    return ''
  }, [offer?.subcategoryId, isEvent])

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      void fetchNextPage()
    }
  }, [data, fetchNextPage, hasNextPage])

  const onSubmitVenueModal = useCallback(
    (nextOfferId: number) => {
      dispatch({ type: 'SET_OFFER_ID', payload: nextOfferId })
    },
    [dispatch]
  )

  if (!selectedStock || typeof quantity !== 'number') return <React.Fragment />

  const priceInCents = quantity * selectedStock.price
  const formattedPriceWithEuro = formatToFrenchDecimal(priceInCents)

  const deductedAmount = `${formattedPriceWithEuro} seront déduits de ton crédit pass Culture`

  const isStockBookable = !(isUserUnderage && selectedStock.isForbiddenToUnderage)

  return isLoading ? (
    <Center testID="loadingScreen">
      <Spacer.Column numberOfSpaces={50} />
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.ButtonText>{loadingMessage}</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={50} />
    </Center>
  ) : (
    <Container>
      <InfoBanner
        message="Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente."
        icon={Error}
      />
      <Spacer.Column numberOfSpaces={6} />

      <Typo.Title4 {...getHeadingAttrs(2)}>Informations</Typo.Title4>
      <Spacer.Column numberOfSpaces={6} />
      <BookingInformations shouldDisplayAddress={!enableMultivenueOffer} />
      <Spacer.Column numberOfSpaces={6} />

      {!!enableMultivenueOffer && (
        <React.Fragment>
          <Separator />

          <Spacer.Column numberOfSpaces={6} />
          <VenueTitleContainer>
            <VenueTitleText>{venueSectionTitle}</VenueTitleText>
            {!!shouldDisplayOtherVenuesAvailableButton && (
              <EditButton
                wording="Modifier"
                accessibilityLabel={`Modifier ${venueSectionTitle}`}
                onPress={showModal}
              />
            )}
          </VenueTitleContainer>

          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption testID="venueName">{venueName}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <VenueAddress testID="venueAddress">{venueFullAddress}</VenueAddress>
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}

      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <CancellationDetails />

      <Spacer.Column numberOfSpaces={6} />

      {!!(offer?.isDuo && !isEvent) && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <DuoChoiceSelector />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}

      <ButtonContainer>
        <ButtonPrimary
          disabled={!isStockBookable}
          wording="Confirmer la réservation"
          onPress={onPressBookOffer}
          accessibilityDescribedBy={accessibilityDescribedBy}
        />
      </ButtonContainer>
      {!!formattedPriceWithEuro && (
        <Caption nativeID={accessibilityDescribedBy}>{deductedAmount}</Caption>
      )}

      {!!shouldDisplayOtherVenuesAvailableButton && (
        <VenueSelectionModal
          isVisible={visible}
          items={venueList}
          onClosePress={hideModal}
          onSubmit={onSubmitVenueModal}
          title={venueSectionTitle}
          onEndReached={onEndReached}
          refreshing={isRefreshing}
          onRefresh={void refetch}
          onScroll={onScrollModal}
        />
      )}
    </Container>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})

const Container = styled.View({ width: '100%' })

const Center = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))

const Caption = styled(Typo.CaptionNeutralInfo)({
  marginTop: getSpacing(1),
  textAlign: 'center',
})

const VenueTitleContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const VenueTitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  flexShrink: 1,
})

const VenueAddress = styled(Typo.Hint)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
