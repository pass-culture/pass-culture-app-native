import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, ReactNode } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from 'react-query'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AsyncError, MonitoringError } from 'libs/errorMonitoring'
import { errorMonitoring } from 'libs/errorMonitoring'
import { AppButton } from 'ui/components/buttons/AppButton'
import { Background } from 'ui/svg/Background'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface AsyncFallbackProps extends FallbackProps {
  resetErrorBoundary: (...args: Array<unknown>) => void
  error: AsyncError
  backNavigation?: boolean
  header?: ReactNode
}

export const AsyncErrorBoundaryWithoutNavigation = ({
  resetErrorBoundary,
  error,
  header,
}: AsyncFallbackProps) => {
  const { reset } = useQueryErrorResetBoundary()

  useEffect(() => {
    // we already captures MonitoringError exceptions (in constructor)
    if (!(error instanceof MonitoringError)) {
      errorMonitoring.captureException(error)
    }
  }, [error])

  const handleRetry = async () => {
    reset()
    resetErrorBoundary()
    if (error?.retry) {
      await error.retry()
    }
  }

  return (
    <Container>
      <Background />
      <Spacer.TopScreen />
      <Spacer.Flex />
      {header}
      <BrokenConnection />
      <Spacer.Column numberOfSpaces={2} />

      <Typo.Title1 color={ColorsEnum.WHITE}>{t`Oops !`}</Typo.Title1>
      <Spacer.Column numberOfSpaces={4} />

      <Row>
        <TextContainer>
          <CenteredText>
            <Typo.Body color={ColorsEnum.WHITE}>
              {t`Une erreur s'est produite pendant le chargement.`}
            </Typo.Body>
          </CenteredText>
        </TextContainer>
      </Row>

      <Spacer.Column numberOfSpaces={8} />

      <Row>
        <ButtonContainer>
          <AppButton
            title={t`Réessayer`}
            onPress={handleRetry}
            textColor={ColorsEnum.WHITE}
            borderColor={ColorsEnum.WHITE}
            loadingIconColor={ColorsEnum.WHITE}
            buttonHeight="tall"
          />
        </ButtonContainer>
      </Row>
      <Spacer.Flex />
      <Spacer.BottomScreen />
    </Container>
  )
}

export const AsyncErrorBoundary = (props: AsyncFallbackProps) => {
  const { canGoBack, goBack } = useNavigation<UseNavigationType>()
  const { top } = useCustomSafeInsets()

  return (
    <AsyncErrorBoundaryWithoutNavigation
      {...props}
      header={
        canGoBack() && (
          <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="backArrow">
            <ArrowPrevious color={ColorsEnum.WHITE} size={getSpacing(10)} />
          </HeaderContainer>
        )
      }
    />
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const ButtonContainer = styled.View({ flex: 1, maxWidth: getSpacing(44) })
const TextContainer = styled.View({ maxWidth: getSpacing(88) })

const CenteredText = styled.Text({
  textAlign: 'center',
})

const HeaderContainer = styled.TouchableOpacity<{ top: number }>(({ top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
}))
