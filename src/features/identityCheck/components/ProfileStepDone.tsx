import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { GreenCheck } from 'ui/svg/icons/GreenCheck'

export const ProfileStepDone: FunctionComponent = () => {
  return (
    <Container testID="profile-step-done">
      <BicolorProfile
        color={theme.colors.greySemiDark}
        color2={theme.colors.greySemiDark}
        size={32}
        transform="translate(0 6) rotate(-8) scale(0.97)"
      />
      <IconContainer>
        <GreenCheck size={16} />
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
