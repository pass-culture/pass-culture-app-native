import React, { useEffect, useRef } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'

export const VenueNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
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
    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  const helmetTitle = 'Lieu introuvable | pass Culture'

  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <GenericInfoPage
        illustration={NoOffer}
        title="Lieu introuvable&nbsp;!"
        subtitle="Il est possible que ce lieu soit désactivé ou n’existe pas."
        buttonPrimary={{
          wording: 'Retourner à l’accueil',
          navigateTo: navigateToHomeConfig,
          onAfterNavigate,
        }}
      />
    </React.Fragment>
  )
}
