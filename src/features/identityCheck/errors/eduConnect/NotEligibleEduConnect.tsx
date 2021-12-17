import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { TextProps, TextStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { useMediaQuery } from 'libs/react-responsive/useMediaQuery'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, getSpacingString, Spacer, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'

import { useNotEligibleEduConnectErrorData } from '../hooks/useNotEligibleEduConnectErrorData'

const SMALL_HEIGHT = 576

export const NotEligibleEduConnect = ({
  error: { message },
  resetErrorBoundary,
}: ScreenErrorProps) => {
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

  const onAbandon = () => {
    navigateToHome()
    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    global.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  if (error) {
    throw error
  }

  return (
    <GenericInfoPage title={title} icon={Icon} iconSize={getSpacing(30)}>
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
      <Spacer.Column numberOfSpaces={12} />
      <ButtonPrimaryWhite
        title={primaryButtonText ?? "Retourner à l'accueil"}
        onPress={onPrimaryButtonPress ?? onAbandon}
      />

      {!!tertiaryButtonVisible && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryWhite
            icon={PlainArrowPrevious}
            title={t`Retourner à l'accueil`}
            onPress={onAbandon}
          />
        </React.Fragment>
      )}
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
