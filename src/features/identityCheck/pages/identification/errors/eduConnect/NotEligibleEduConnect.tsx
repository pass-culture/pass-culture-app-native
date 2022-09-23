import React, { useEffect, useRef, useState } from 'react'
import { TextProps, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

import { useNotEligibleEduConnectErrorData } from '../hooks/useNotEligibleEduConnectErrorData'

export const NotEligibleEduConnect = ({
  error: { message },
  resetErrorBoundary,
}: ScreenErrorProps) => {
  const timer = useRef<number>()
  const [error, setError] = useState<Error | undefined>()
  const {
    title,
    description,
    descriptionAlignment,
    Illustration,
    primaryButton,
    isGoHomeTertiaryButtonVisible = false,
  } = useNotEligibleEduConnectErrorData(message, setError)

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

  if (error) {
    throw error
  }

  const helmetTitle = `Page erreur\u00a0: ${title} | pass Culture`

  const goBackToHomeTertiaryButton = (
    <TouchableLink
      key={2}
      as={ButtonTertiaryWhite}
      icon={PlainArrowPrevious}
      wording="Retourner à l'accueil"
      navigateTo={navigateToHomeConfig}
      onPress={onAbandon}
      navigateBeforeOnPress
    />
  )

  return (
    <GenericInfoPage
      title={title}
      icon={Illustration}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={primaryButton?.primaryButtonText ?? "Retourner à l'accueil"}
          navigateTo={primaryButton?.navigateTo ?? navigateToHomeConfig}
          onPress={primaryButton?.onPrimaryButtonPress}
          icon={primaryButton?.primaryButtonIcon}
        />,
        !!isGoHomeTertiaryButtonVisible && goBackToHomeTertiaryButton,
      ].filter(Boolean)}>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <Body textAlign={descriptionAlignment}>{description}</Body>
    </GenericInfoPage>
  )
}

type TextBodyProps = TextProps & {
  textAlign?: Exclude<TextStyle['textAlign'], 'auto'>
}
const Body = styled(Typo.Body).attrs<TextBodyProps>((props) => props)<TextBodyProps>(
  ({ theme, textAlign }) => ({
    ...theme.typography.body,
    textAlign,
    color: theme.colors.white,
  })
)
