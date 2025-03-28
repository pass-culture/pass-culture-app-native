import React, { useEffect, useRef } from 'react'
import { TextProps, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { computePrimaryButtonToDisplay } from 'features/identityCheck/pages/identification/errors/eduConnect/helpers/computePrimaryButtonToDisplay'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageDeprecated } from 'ui/pages/GenericInfoPageDeprecated'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

import { useNotEligibleEduConnectErrorData } from '../hooks/useNotEligibleEduConnectErrorData'

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
    primaryButton: primaryButtonProps,
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

  const goBackToHomeTertiaryButton = (
    <InternalTouchableLink
      key={2}
      as={ButtonTertiaryWhite}
      icon={PlainArrowPrevious}
      wording="Retourner à l’accueil"
      navigateTo={navigateToHomeConfig}
      onAfterNavigate={onAbandon}
    />
  )

  const primaryButton = computePrimaryButtonToDisplay({ button: primaryButtonProps })

  return (
    <GenericInfoPageDeprecated
      title={title}
      icon={Illustration}
      buttons={[
        primaryButton,
        !!isGoHomeTertiaryButtonVisible && goBackToHomeTertiaryButton,
      ].filter(Boolean)}>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <Body textAlign={descriptionAlignment}>{description}</Body>
    </GenericInfoPageDeprecated>
  )
}

type TextBodyProps = TextProps & {
  textAlign?: Exclude<TextStyle['textAlign'], 'auto'>
}
const Body = styled(Typo.Body).attrs<TextBodyProps>((props) => props)<TextBodyProps>(
  ({ theme, textAlign }) => ({
    textAlign,
    color: theme.colors.white,
  })
)
