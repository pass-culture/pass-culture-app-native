import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import InAppReview from 'react-native-in-app-review'
import styled from 'styled-components/native'

import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { formatToFrenchDecimal } from 'libs/parsers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()
  const { reset } = useNavigation<UseNavigationType>()
  const credit = useAvailableCredit()
  const {
    shouldReviewBeRequested,
    updateInformationWhenReviewHasBeenRequested,
  } = useReviewInAppInformation()

  const amountLeft = credit && !credit.isExpired ? credit.amount : 0

  const displayBookingDetails = () => {
    analytics.logSeeMyBooking(params.offerId)
    reset({
      index: 1,
      routes: [
        {
          name: 'TabNavigator',
          state: {
            routes: [{ name: 'Bookings' }],
            index: 0,
          },
        },
        {
          name: 'BookingDetails',
          params: {
            id: params.bookingId,
          },
        },
      ],
    })
  }

  useEffect(() => {
    if (
      InAppReview.isAvailable() &&
      env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING &&
      shouldReviewBeRequested
    ) {
      setTimeout(
        () =>
          InAppReview.RequestInAppReview()
            .then((hasFlowFinishedSuccessfully) => {
              updateInformationWhenReviewHasBeenRequested(hasFlowFinishedSuccessfully)
            })
            .catch((error) => {
              // TODO (LucasBeneston) : How to deal with review in app error https://github.com/MinaSamir11/react-native-in-app-review#error-could-happen-and-code-number ?
              // eslint-disable-next-line no-console
              console.log(error)
            }),
        3000
      )
    }
  }, [shouldReviewBeRequested])

  return (
    <GenericInfoPage
      title={t`Réservation confirmée !`}
      icon={TicketBooked}
      iconSize={getSpacing(65)}>
      <StyledBody>
        {t({
          id: 'credit left to spend',
          values: { credit: formatToFrenchDecimal(amountLeft) },
          message: 'Il te reste encore {credit} à dépenser sur le pass !',
        })}
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        {t`Tu peux retrouver toutes les informations concernant ta réservation sur l’application`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite title={t`Voir ma réservation`} onPress={displayBookingDetails} />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
