import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { EligibilityType, OfferStockResponse, SubcategoryIdEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { Item } from 'features/bookings/components/BookingItemWithIcon'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { BookingInformations } from 'features/bookOffer/components/BookingInformations'
import { CancellationDetails } from 'features/bookOffer/components/CancellationDetails'
import { CguDetails } from 'features/bookOffer/components/CguDetails'
import { CguWithCheckbox } from 'features/bookOffer/components/CguWithCheckbox'
import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { RotatingTextOptions, useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { getVenueSelectionHeaderMessage } from 'features/offer/helpers/getVenueSelectionHeaderMessage'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location/location'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { useSearchVenueOffersInfiniteQuery } from 'queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery'
import { hiddenFromScreenReader } from 'shared/accessibility/hiddenFromScreenReader'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Loader } from 'ui/components/Loader'
import { useModal } from 'ui/components/modals/useModal'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Error } from 'ui/svg/icons/Error'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface BookingDetailsProps {
  stocks: OfferStockResponse[]
  onPressBookOffer: VoidFunction
  isLoading?: boolean
}

const ANIMATION_DURATION = 500 //ms

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
  const { bookingState, dispatch } = useBookingContext()
  const { user } = useAuthContext()
  const selectedStock = useBookingStock()
  const offer = useBookingOfferQuery()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const isUserUnderage = useIsUserUnderage()
  const mapping = useSubcategoriesMapping()
  const { quantity } = bookingState

  const isEvent = offer?.subcategoryId ? mapping[offer?.subcategoryId]?.isEvent : undefined

  const loadingMessage = useRotatingText(LOADING_MESSAGES, isLoading)

  const isMultivenueCompatibleOffer = Boolean(
    offer?.subcategoryId === SubcategoryIdEnum.LIVRE_PAPIER ||
      offer?.subcategoryId === SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE
  )
  const shouldFetchSearchVenueOffers = Boolean(isMultivenueCompatibleOffer && offer?.extraData?.ean)

  const { onScroll: onScrollModal } = useOpacityTransition()
  const { userLocation, selectedLocationMode, place } = useLocation()
  const venueName = offer?.address?.label || offer?.venue.name

  const headerMessage = getVenueSelectionHeaderMessage(selectedLocationMode, place, venueName)

  const defaultSearchVenueOffers = {
    offerId: 0,
    venueId: undefined,
    geolocation: {
      latitude: offer?.venue?.coordinates?.latitude ?? 0,
      longitude: offer?.venue?.coordinates?.longitude ?? 0,
    },
    query: '',
    enabled: shouldFetchSearchVenueOffers,
  }
  const currentSearchVenueOffers = {
    offerId: offer?.id,
    venueId: offer?.venue?.id,
    geolocation: userLocation,
    query: offer?.extraData?.ean,
  }
  const {
    hasNextPage,
    fetchNextPage,
    refetch,
    data,
    venueList,
    isFetching,
    nbVenueItems,
    nbHits,
    nbLoadedHits,
    isFetchingNextPage,
  } = useSearchVenueOffersInfiniteQuery(
    Object.assign(defaultSearchVenueOffers, currentSearchVenueOffers)
  )
  const [isCguChecked, setIsCguChecked] = useState(false)

  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)

  const shouldDisplayOtherVenuesAvailableButton = Boolean(
    shouldFetchSearchVenueOffers && nbVenueItems > 0
  )

  const venueStreet = offer?.address?.street || offer?.venue.address
  const venuePostalCode = offer?.address?.postalCode || offer?.venue.postalCode
  const venueCity = offer?.address?.city || offer?.venue.city

  const venueFullAddress = formatFullAddress(venueStreet, venuePostalCode, venueCity)

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
      fetchNextPage()
    }
  }, [data, fetchNextPage, hasNextPage])

  const onSubmitVenueModal = useCallback(
    (nextOfferId: number) => {
      hideModal()
      dispatch({ type: 'CHANGE_OFFER', payload: nextOfferId })
    },
    [dispatch, hideModal]
  )

  if (!selectedStock || typeof quantity !== 'number') return null

  const priceInCents = quantity * selectedStock.price
  const formattedPriceWithEuro = formatCurrencyFromCents(
    priceInCents,
    currency,
    euroToPacificFrancRate
  )

  const isNotUserFreeStatus = user?.eligibility !== EligibilityType.free
  const deductedAmount = `${formattedPriceWithEuro} seront déduits de ton crédit pass Culture`

  const isStockBookable = !(isUserUnderage && selectedStock.isForbiddenToUnderage)

  const isBookingConfirmationButtonDisabled = !isStockBookable || !isCguChecked

  const isFreeOfferToArchive =
    !!offer && FREE_OFFER_CATEGORIES_TO_ARCHIVE.includes(offer.subcategoryId)

  return isLoading ? (
    <Loader message={loadingMessage} />
  ) : (
    <Container>
      <Banner
        label="Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente."
        Icon={Error}
      />
      <Spacer.Column numberOfSpaces={6} />

      <Typo.Title4 {...getHeadingAttrs(2)}>Informations</Typo.Title4>
      <Spacer.Column numberOfSpaces={6} />
      <BookingInformations />
      <Spacer.Column numberOfSpaces={6} />

      <Separator />

      <Spacer.Column numberOfSpaces={6} />
      <VenueTitleContainer>
        <VenueTitleText>{venueSectionTitle}</VenueTitleText>
        {shouldDisplayOtherVenuesAvailableButton ? (
          <EditButton
            wording="Modifier"
            accessibilityLabel={`Modifier ${venueSectionTitle}`}
            onPress={showModal}
          />
        ) : null}
      </VenueTitleContainer>

      <Spacer.Column numberOfSpaces={4} />
      <Item
        Icon={LocationBuilding}
        message={
          <VenueContainer>
            <Typo.BodyAccentXs testID="venueName">{venueName}</Typo.BodyAccentXs>
            <Spacer.Column numberOfSpaces={1} />
            <VenueAddress testID="venueAddress">{venueFullAddress}</VenueAddress>
          </VenueContainer>
        }
      />
      <Spacer.Column numberOfSpaces={6} />

      {isFreeOfferToArchive ? null : (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <CancellationDetails />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}

      <React.Fragment>
        <Separator />
        <Spacer.Column numberOfSpaces={6} />
        <CguDetails>
          <CguWithCheckbox isChecked={isCguChecked} setIsChecked={setIsCguChecked} />
        </CguDetails>
      </React.Fragment>

      <Spacer.Column numberOfSpaces={6} />

      {offer?.isDuo && !isEvent ? (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <DuoChoiceSelector />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}

      <ButtonContainer>
        <ButtonPrimary
          disabled={isBookingConfirmationButtonDisabled}
          wording="Confirmer la réservation"
          onPress={onPressBookOffer}
          accessibilityHint={deductedAmount}
        />
      </ButtonContainer>
      {formattedPriceWithEuro && isNotUserFreeStatus ? (
        <Caption {...hiddenFromScreenReader()}>{deductedAmount}</Caption>
      ) : null}
      {shouldDisplayOtherVenuesAvailableButton ? (
        <VenueSelectionModal
          isVisible={visible}
          items={venueList}
          onClosePress={hideModal}
          onSubmit={onSubmitVenueModal}
          title={venueSectionTitle}
          onEndReached={onEndReached}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onScroll={onScrollModal}
          nbHits={nbHits}
          nbLoadedHits={nbLoadedHits}
          isFetchingNextPage={isFetchingNextPage}
          isSharingLocation={userLocation !== null || userLocation !== undefined}
          subTitle="Sélectionner un lieu"
          rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
          validateButtonLabel="Choisir ce lieu"
          headerMessage={headerMessage}
        />
      ) : null}
    </Container>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})

const Container = styled.View({ width: '100%' })

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const Caption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))

const VenueTitleContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const VenueTitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  flexShrink: 1,
})

const VenueAddress = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const VenueContainer = styled.View({
  flexDirection: 'column',
})
