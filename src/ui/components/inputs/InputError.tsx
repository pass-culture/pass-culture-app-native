import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Error } from 'ui/svg/icons/Error'
import { ErrorMessage } from 'ui/web/errors/ErrorMessage'

import { InputRule } from './rules/InputRule'

interface Props {
  errorMessage?: string | null
  visible: boolean
  numberOfSpacesTop: number
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
  return (
    <ErrorMessage>
      {visible && messageId ? (
        <Container
          numberOfSpacesTop={numberOfSpacesTop}
          accessibilityElementsHidden={accessibilityElementsHidden}
          importantForAccessibility={accessibilityElementsHidden ? 'no' : 'auto'}>
          <InputRule
            title={messageId}
            type="Error"
            icon={Error}
            testIdSuffix="warn"
            iconSize={16}
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
