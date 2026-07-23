import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { genericInfoPageIllustrationUrls } from 'shared/illustrations/genericInfoPageIllustrations'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'

export const OfferNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const { isDesktopViewport } = useTheme()
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
  const helmetTitle = 'Offre introuvable | pass Culture'
  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <GenericInfoPage
        illustration={NoOffer}
        remoteIllustration={{
          url: genericInfoPageIllustrationUrls.emptyDigitalWindowLarge,
          backgroundColor: 'pending01',
          size: isDesktopViewport ? 'default' : 'small',
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
