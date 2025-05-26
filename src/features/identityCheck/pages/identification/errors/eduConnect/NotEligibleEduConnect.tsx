import React, { useEffect, useRef } from 'react'
import { TextProps, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { useNotEligibleEduConnectErrorData } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonProps, GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Typo } from 'ui/theme'

export const NotEligibleEduConnect = ({
  error: { message },
  resetErrorBoundary,
}: ScreenErrorProps) => {
  const timer = useRef<NodeJS.Timeout>()
  const {
    title,
    description,
    descriptionAlignment,
    Illustration,
    primaryButton,
    isGoHomeTertiaryButtonVisible = false,
  } = useNotEligibleEduConnectErrorData(message)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    []
  )

  const onAbandon = () => {
    analytics.logBackToHomeFromEduconnectError({ fromError: message })
    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  const helmetTitle = `Page erreur\u00a0: ${title} | pass Culture`

  let buttonPrimary: ButtonProps | undefined = undefined
  if (primaryButton) {
    if (primaryButton.navigateTo) {
      buttonPrimary = {
        wording: primaryButton.wording,
        navigateTo: primaryButton.navigateTo,
        icon: primaryButton.icon,
        onBeforeNavigate: primaryButton.onPress,
      }
    } else if (primaryButton.externalNav) {
      buttonPrimary = {
        wording: primaryButton.wording,
        externalNav: primaryButton.externalNav,
        icon: primaryButton.icon,
        onBeforeNavigate: primaryButton.onPress,
      }
    }
  }

  const defaultGoToHomeButton = {
    wording: 'Retourner à l’accueil',
    navigateTo: navigateToHomeConfig,
    onAfterNavigate: onAbandon,
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <GenericInfoPage
        illustration={Illustration}
        title={title}
        buttonPrimary={buttonPrimary ?? defaultGoToHomeButton}
        buttonTertiary={isGoHomeTertiaryButtonVisible ? defaultGoToHomeButton : undefined}>
        <Body textAlign={descriptionAlignment}>{description}</Body>
      </GenericInfoPage>
    </React.Fragment>
  )
}

type TextBodyProps = TextProps & {
  textAlign?: Exclude<TextStyle['textAlign'], 'auto'>
}

const Body = styled(Typo.Body)<TextBodyProps>(({ textAlign }) => ({
  textAlign,
}))
