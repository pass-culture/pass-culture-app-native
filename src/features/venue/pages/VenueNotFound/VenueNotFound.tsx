import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Typo } from 'ui/theme'

export const VenueNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<NodeJS.Timeout>()

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

  const helmetTitle = 'Lieu introuvable | pass Culture'

  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <GenericInfoPage
        title="Lieu introuvable&nbsp;!"
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
        <StyledBody>Il est possible que ce lieu soit désactivé ou n’existe pas.</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
