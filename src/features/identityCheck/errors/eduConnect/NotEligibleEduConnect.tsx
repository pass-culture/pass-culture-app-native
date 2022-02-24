import { t } from '@lingui/macro'
import React, { useEffect, useRef, useState } from 'react'
import { TextProps, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
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
    Icon,
    primaryButtonText,
    tertiaryButtonVisible = false,
    onPrimaryButtonPress,
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
    navigateToHome()
    analytics.logBackToHomeFromEduconnectError({ fromError: message })
    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  if (error) {
    throw error
  }

  return (
    <GenericInfoPage
      title={title}
      icon={Icon}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          wording={primaryButtonText ?? "Retourner à l'accueil"}
          onPress={onPrimaryButtonPress ?? onAbandon}
        />,
        !!tertiaryButtonVisible && (
          <ButtonTertiaryWhite
            key={2}
            icon={PlainArrowPrevious}
            wording={t`Retourner à l'accueil`}
            onPress={onAbandon}
          />
        ),
      ].filter(Boolean)}>
      <Helmet>
        <title>{t`Page erreur\u00a0:` + title + ' | pass Culture'}</title>
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
