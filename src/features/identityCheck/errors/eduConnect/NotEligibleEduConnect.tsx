import { t } from '@lingui/macro'
import React, { useEffect, useRef, useState } from 'react'
import { TextProps, TextStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, getSpacingString, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'

import { useNotEligibleEduConnectErrorData } from '../hooks/useNotEligibleEduConnectErrorData'

const SMALL_HEIGHT = 576

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
  const { colors } = useTheme()
  const isSmallScreen = useMediaQuery({ maxHeight: SMALL_HEIGHT })
  const getGrid = useGrid()
  const bodyFontSize = getSpacing(getGrid({ default: 3.75, sm: 3 }, 'height'))

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
          title={primaryButtonText ?? "Retourner à l'accueil"}
          onPress={onPrimaryButtonPress ?? onAbandon}
        />,
        !!tertiaryButtonVisible && (
          <ButtonTertiaryWhite
            key={2}
            icon={PlainArrowPrevious}
            title={t`Retourner à l'accueil`}
            onPress={onAbandon}
          />
        ),
      ].filter(Boolean)}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Body
        textAlign={descriptionAlignment}
        color={colors.white}
        fontSize={bodyFontSize}
        isSmallScreen={!!isSmallScreen}>
        {description}
      </Body>
    </GenericInfoPage>
  )
}

type TextBodyProps = TextProps & {
  isSmallScreen: boolean
  fontSize: number
  textAlign?: Exclude<TextStyle['textAlign'], 'auto'>
}
const Body = styled(Typo.Body).attrs<TextBodyProps>((props) => props)<TextBodyProps>(
  ({ theme, isSmallScreen, fontSize, textAlign }) => ({
    ...theme.typography.body,
    fontSize,
    lineHeight: getSpacingString(isSmallScreen ? 4 : 5),
    textAlign,
  })
)
