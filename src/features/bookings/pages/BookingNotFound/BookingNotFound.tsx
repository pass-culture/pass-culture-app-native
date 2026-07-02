import React, { useEffect, useRef } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoBookings } from 'ui/svg/icons/NoBookings'

export const BookingNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<NodeJS.Timeout>(null)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    []
  )

  async function onAfterNavigate() {
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
        illustration={NoBookings}
        title="Réservation introuvable&nbsp;!"
        subtitle="Désolé, nous ne retrouvons pas ta réservation. Peut-être a-t-elle été annulée. N’hésite pas à retrouver la liste de tes réservations terminées et annulées pour t’en assurer."
        buttonPrimary={{
          wording: 'Mes réservations terminées',
          navigateTo: { screen: 'Bookings' },
          onAfterNavigate,
        }}
        buttonTertiary={{
          wording: 'Retourner à l’accueil',
          navigateTo: navigateToHomeConfig,
        }}
      />
    </React.Fragment>
  )
}
