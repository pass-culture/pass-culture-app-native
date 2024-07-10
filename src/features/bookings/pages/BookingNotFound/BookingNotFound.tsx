import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { Typo } from 'ui/theme'

export const BookingNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<NodeJS.Timeout>()
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    []
  )

  async function onPress() {
    // TODO(PC-26467): check if this can be removed. https://github.com/tannerlinsley/react-query/releases/tag/v3.32.3
    // if we reset too fast, it will rerun the failed query, this has no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  const title = 'Réservation introuvable | pass Culture'

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <GenericInfoPage
        title="Réservation introuvable&nbsp;!"
        icon={NoBookings}
        buttons={[
          <InternalTouchableLink
            key={1}
            as={ButtonPrimaryWhite}
            wording="Mes réservations terminées"
            navigateTo={{ screen: enableBookingImprove ? 'Bookings' : 'EndedBookings' }}
            onAfterNavigate={onPress}
          />,
          <InternalTouchableLink
            key={2}
            as={ButtonTertiaryWhite}
            wording="Retourner à l’accueil"
            navigateTo={navigateToHomeConfig}
          />,
        ]}>
        <StyledBody>
          Désolé, nous ne retrouvons pas ta réservation. Peut-être a-t-elle été annulée. N’hésite
          pas à retrouver la liste de tes réservations terminées et annulées pour t’en assurer.
        </StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
