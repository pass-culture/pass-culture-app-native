import { t } from '@lingui/macro'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useQueryErrorResetBoundary } from 'react-query'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { AppButton } from 'ui/components/buttons/AppButton'
import { Background } from 'ui/svg/Background'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export class AsyncError extends Error {
  public retryPromise?: () => Promise<unknown>
  constructor(message: string, retryPromise?: () => Promise<unknown>) {
    super(message)
    this.retryPromise = retryPromise
  }
}

interface FallbackProps {
  error: AsyncError
  resetErrorBoundary: (...args: Array<unknown>) => void
}

export const AsyncErrorBoundary = ({ resetErrorBoundary, error }: FallbackProps) => {
  const { reset } = useQueryErrorResetBoundary()
  const { canGoBack, goBack } = useNavigation<UseNavigationType>()
  const state = useNavigationState((state) => state)
  const { top } = useCustomSafeInsets()

  const handleRetry = useCallback(() => {
    reset()
    resetErrorBoundary()
    if (error?.retryPromise) {
      return error.retryPromise()
    }
    return null
  }, [reset, resetErrorBoundary, state, error])

  return (
    <Container>
      <Background />
      <Spacer.Flex />
      {canGoBack() && (
        <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="backArrow">
          <ArrowPrevious color={ColorsEnum.WHITE} size={getSpacing(10)} />
        </HeaderContainer>
      )}
      <BrokenConnection />
      <Spacer.Column numberOfSpaces={2} />

      <Typo.Title1 color={ColorsEnum.WHITE}>{_(t`Oops !`)}</Typo.Title1>
      <Spacer.Column numberOfSpaces={4} />

      <Row>
        <TextContainer>
          <CenteredText>
            <Typo.Body color={ColorsEnum.WHITE}>
              {_(t`Une erreur s'est produite pendant le chargement.`)}
            </Typo.Body>
          </CenteredText>
        </TextContainer>
      </Row>

      <Spacer.Column numberOfSpaces={8} />

      <Row>
        <ButtonContainer>
          <AppButton
            title={_(t`Réessayer`)}
            onPress={handleRetry}
            textColor={ColorsEnum.WHITE}
            borderColor={ColorsEnum.WHITE}
            loadingIconColor={ColorsEnum.WHITE}
            buttonHeight="tall"
          />
        </ButtonContainer>
      </Row>
      <Spacer.Flex />
    </Container>
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
