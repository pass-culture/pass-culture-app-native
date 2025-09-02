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
  relatedInputId?: string
}

export const InputError: FC<Props> = (props) => {
  return (
    <ErrorMessage relatedInputId={props.relatedInputId}>
      {props.visible && props.errorMessage ? (
        <Container numberOfSpacesTop={props.numberOfSpacesTop}>
          <InputRule
            title={props.errorMessage}
            type="Error"
            icon={Error}
            testIdSuffix="warn"
            iconSize={16}
            noFullWidth={props.centered}
          />
        </Container>
      ) : null}
    </ErrorMessage>
  )
}

const Container = styled.View<{ numberOfSpacesTop: number }>(({ numberOfSpacesTop }) => ({
  marginTop: numberOfSpacesTop,
}))
