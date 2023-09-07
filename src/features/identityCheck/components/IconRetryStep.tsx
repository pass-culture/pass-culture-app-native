import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TryAgain } from 'ui/svg/icons/TryAgain'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface IconStepRetryProps {
  Icon: FunctionComponent<
    AccessibleIcon & {
      transform?: string
    }
  >
  testID?: string
}
export const IconRetryStep: FunctionComponent<IconStepRetryProps> = ({ Icon, testID }) => {
  return (
    <Container testID={testID}>
      <Icon size={32} />
      <IconContainer>
        <TryAgain size={16} />
      </IconContainer>
    </Container>
  )
}

const IconContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  right: 0,
})
const Container = styled.View({
  width: 36,
  height: 34,
})
