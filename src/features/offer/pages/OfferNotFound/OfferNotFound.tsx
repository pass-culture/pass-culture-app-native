import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Typo } from 'ui/theme'

export const OfferNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<number>()

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    []
  )

  async function onPress() {
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
        title="Offre introuvable&nbsp;!"
        icon={NoOffer}
        buttons={[
          <InternalTouchableLink
            key={1}
            as={ButtonPrimaryWhite}
            wording="Retourner à l’accueil"
            navigateTo={navigateToHomeConfig}
            onAfterNavigate={onPress}
          />,
        ]}>
        <StyledBody>Il est possible que cette offre soit désactivée ou n’existe pas.</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
