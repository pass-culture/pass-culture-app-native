import { t } from '@lingui/macro'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from 'react-query'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { AppButton } from 'ui/components/buttons/AppButton'
import { Background } from 'ui/svg/Background'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const RetryBoundary = ({ resetErrorBoundary }: FallbackProps) => {
  const { reset } = useQueryErrorResetBoundary()

  const handleRetry = () => {
    reset()
    resetErrorBoundary()
  }

  return (
    <Container>
      <Background />
      <Spacer.Flex />

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
