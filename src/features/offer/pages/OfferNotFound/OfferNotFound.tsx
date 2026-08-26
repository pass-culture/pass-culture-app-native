import React, { useEffect, useRef } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { WebMetaHeader } from 'shared/WebMetaHeader/WebMetaHeader'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'

export const OfferNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<number>(null)

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
  return (
    <React.Fragment>
      <WebMetaHeader title="Offre introuvable" />
      <GenericInfoPage
        illustration={NoOffer}
        remoteIllustration={{
          url: remoteIllustrationUrls.emptyDigitalWindowLarge,
          backgroundColor: 'pending01',
        }}
        title="Offre introuvable&nbsp;!"
        subtitle="Il est possible que cette offre soit désactivée ou n’existe pas."
        buttonPrimary={{
          wording: 'Retourner à l’accueil',
          navigateTo: navigateToHomeConfig,
          onAfterNavigate,
        }}
      />
    </React.Fragment>
  )
}
