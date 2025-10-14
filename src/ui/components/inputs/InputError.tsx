import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ErrorPlain } from 'ui/svg/icons/ErrorPlain'
import { ErrorMessage } from 'ui/web/errors/ErrorMessage'

import { InputRule } from './rules/InputRule'

interface Props {
  errorMessage?: string | null
  visible: boolean
  numberOfSpacesTop?: number
  centered?: boolean
  accessibilityElementsHidden?: boolean
}

export const InputError: FC<Props> = ({
  errorMessage: messageId,
  visible,
  numberOfSpacesTop,
  centered,
  accessibilityElementsHidden = true,
}) => {
  const theme = useTheme()
  return (
    <ErrorMessage>
      {visible && messageId ? (
        <Container
          numberOfSpacesTop={numberOfSpacesTop ?? theme.designSystem.size.spacing.xxs}
          accessibilityElementsHidden={accessibilityElementsHidden}
          importantForAccessibility={accessibilityElementsHidden ? 'no' : 'auto'}>
          <InputRule
            title={messageId}
            type="Error"
            icon={ErrorPlain}
            testIdSuffix="warn"
            iconSize={theme.icons.sizes.extraSmall}
            noFullWidth={centered}
          />
        </Container>
      ) : null}
    </ErrorMessage>
  )
}

const Container = styled.View<{ numberOfSpacesTop: number }>(({ numberOfSpacesTop }) => ({
  marginTop: numberOfSpacesTop,
  width: '100%',
}))
