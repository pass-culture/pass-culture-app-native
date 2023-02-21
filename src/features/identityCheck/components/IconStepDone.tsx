import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { GreenCheck } from 'ui/svg/icons/GreenCheck'
import { AccessibleIcon } from 'ui/svg/icons/types'

interface IconStepDoneProps {
  Icon: FunctionComponent<
    AccessibleIcon & {
      transform?: string
    }
  >
  testID?: string
}
export const IconStepDone: FunctionComponent<IconStepDoneProps> = ({ Icon, testID }) => {
  return (
    <Container testID={testID}>
      <Icon
        color={theme.colors.greySemiDark}
        color2={theme.colors.greySemiDark}
        size={32}
        transform="translate(0 6) rotate(-8) scale(0.97)"
      />
      <IconContainer>
        <GreenCheck size={15} />
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
  width: 34,
  height: 34,
})
