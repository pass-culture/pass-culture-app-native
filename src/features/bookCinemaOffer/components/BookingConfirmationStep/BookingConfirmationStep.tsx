import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import { isApiError } from 'api/apiHelpers'
import { RecommendationApiParams, SubcategoryIdEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookingSelectedStockQuery } from 'features/bookCinemaOffer/queries/useBookingSelectedStockQuery/useBookingSelectedStockQuery'
import { Item } from 'features/bookings/components/BookingItemWithIcon'
import { CancellationDetails } from 'features/bookOffer/components/CancellationDetails'
import { CguDetails } from 'features/bookOffer/components/CguDetails'
import { CguWithCheckbox } from 'features/bookOffer/components/CguWithCheckbox'
import { EventBookingInformations } from 'features/bookOffer/components/EventBookingInformations'
import { BOOKING_CONFIRMATION_LOADING_MESSAGES } from 'features/bookOffer/helpers/bookingConfirmationLoadingMessages'
import { BookingQuantity } from 'features/bookOffer/helpers/bookingQuantity'
import { errorCodeToMessage } from 'features/bookOffer/helpers/errorCodeToMessage'
import {
  getBookingDetails,
  getVenueBookingDetails,
} from 'features/bookOffer/helpers/getBookingDetails'
import { useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { Referrals, UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { logOfferConversion } from 'libs/algolia/analytics/logOfferConversion'
import { algoliaAnalyticsSelectors } from 'libs/algolia/store/algoliaAnalyticsStore'
import { analytics } from 'libs/analytics/provider'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { hiddenFromScreenReader } from 'shared/accessibility/helpers/hiddenFromScreenReader'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Loader } from 'ui/components/Loader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Error } from 'ui/svg/icons/Error'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props = {
  offerId: number
  stockId?: number
  quantity?: BookingQuantity
  from?: Referrals
  fromOfferId?: number
  fromMultivenueOfferId?: number
  apiRecoParams?: string
  playlistType?: PlaylistType
}

export const BookingConfirmationStep: React.FC<Props> = ({
  offerId,
  stockId,
  quantity,
  from,
  fromOfferId,
  fromMultivenueOfferId,
  apiRecoParams,
  playlistType,
}) => {
  const { data: stock } = useBookingSelectedStockQuery(offerId, stockId)
  const { data: offer } = useOfferQuery({ offerId })
  const { user } = useAuthContext()
  const isUserUnderage = useIsUserUnderage()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const { replace, goBack } = useNavigation<UseNavigationType>()
  const [isCguChecked, setIsCguChecked] = useState(false)
  const { mutate, isPending } = useBookOfferMutation({
    onSuccess: ({ bookingId }: { bookingId: number }) => {
      const parsedApiRecoParams: RecommendationApiParams | undefined = apiRecoParams
        ? JSON.parse(apiRecoParams)
        : undefined
      void analytics.logBookingConfirmation({
        ...parsedApiRecoParams,
        offerId: offerId.toString(),
        bookingId: bookingId.toString(),
        fromOfferId: fromMultivenueOfferId ? undefined : fromOfferId?.toString(),
        fromMultivenueOfferId: fromMultivenueOfferId?.toString(),
        playlistType,
      })
      if (from === 'searchresults') {
        const currentQueryID = algoliaAnalyticsSelectors.selectCurrentQueryID()
        void logOfferConversion({ objectID: offerId.toString(), queryID: currentQueryID })
      }
      if (offer?.subcategoryId === SubcategoryIdEnum.SEANCE_CINE) {
        void analytics.logHasBookedCineScreeningOffer({ offerId })
      }
      replace('BookingConfirmation', { offerId, bookingId })
    },
    onError: (error?: ApiError | Error) => {
      let message = 'En raison d’une erreur technique, l’offre n’a pas pu être réservée'
      if (isApiError(error)) {
        const { content } = error as { content: { code: string } }
        const errorMessage = errorCodeToMessage[content.code]
        if (errorMessage) {
          message = errorMessage
          void analytics.logBookingError(offerId, content.code)
        }
      }
      goBack()
      showErrorSnackBar(message)
    },
  })
  const loadingMessage = useRotatingText(BOOKING_CONFIRMATION_LOADING_MESSAGES, isPending)

  if (!offer || !quantity || !stock) return null

  const {
    formattedPriceWithEuro,
    isNotUserFreeStatus,
    isBookingConfirmationButtonDisabled,
    isFreeOfferToArchive,
    deductedAmount,
  } = getBookingDetails({
    offer,
    selectedStock: stock,
    quantity,
    user,
    isUserUnderage,
    isCguChecked,
    currency,
    euroToPacificFrancRate,
  })

  if (isPending) {
    return <Loader message={loadingMessage} />
  }

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, true)
  const { venueFullAddress, venueName } = getVenueBookingDetails({
    offer,
    shouldFetchSearchVenueOffers: false,
    nbVenueItems: 0,
  })

  const onPressBookOffer = () => {
    if (stockId) {
      mutate({ quantity, stockId })
    }
  }

  return (
    <MainContainer>
      <Banner
        label="Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente."
        Icon={Error}
      />
      <Container>
        <Typo.Title4 {...setTextSemantic('h2')}>Informations</Typo.Title4>
      </Container>
      <BookingInformationsContainer>
        <EventBookingInformations offer={offer} stock={stock} quantity={quantity} />
      </BookingInformationsContainer>
      {offer.isDigital ? null : (
        <React.Fragment>
          <Separator />
          <VenueAddressContainer>
            <VenueTitleContainer>
              <VenueTitleText>{venueSectionTitle}</VenueTitleText>
            </VenueTitleContainer>
            <ItemContainer>
              <Item
                Icon={LocationBuilding}
                message={
                  <VenueContainer>
                    <Typo.BodyAccentXs testID="venueName">{venueName}</Typo.BodyAccentXs>
                    <VenueAddress testID="venueAddress">{venueFullAddress}</VenueAddress>
                  </VenueContainer>
                }
              />
            </ItemContainer>
          </VenueAddressContainer>
        </React.Fragment>
      )}
      {isFreeOfferToArchive ? null : (
        <React.Fragment>
          <Separator />
          <Container>
            <CancellationDetails stock={stock} offer={offer} />
          </Container>
        </React.Fragment>
      )}
      <StyledViewGap gap={6}>
        <Separator />
        <CguDetails>
          <CguWithCheckbox isChecked={isCguChecked} setIsChecked={setIsCguChecked} />
        </CguDetails>
      </StyledViewGap>
      <ButtonContainer>
        <Button
          disabled={isBookingConfirmationButtonDisabled}
          wording="Confirmer la réservation"
          onPress={onPressBookOffer}
          accessibilityHint={deductedAmount}
          fullWidth
        />
      </ButtonContainer>
      {formattedPriceWithEuro && isNotUserFreeStatus ? (
        <Caption {...hiddenFromScreenReader()}>{deductedAmount}</Caption>
      ) : null}
    </MainContainer>
  )
}

const ItemContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled.View({
  alignItems: 'center',
})

const Container = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))

const BookingInformationsContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const VenueAddressContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))

const MainContainer = styled.View({ width: '100%' })

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const Caption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))

const VenueTitleContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: theme.designSystem.size.spacing.l,
}))

const VenueTitleText = styled(Typo.Title4).attrs(setTextSemantic('h2'))({
  flexShrink: 1,
})

const VenueAddress = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const VenueContainer = styled.View(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.designSystem.size.spacing.xs,
}))
