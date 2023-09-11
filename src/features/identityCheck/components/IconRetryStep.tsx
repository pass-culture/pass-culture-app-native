import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { TryAgain } from 'ui/svg/icons/TryAgain'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

interface IconStepRetryProps {
  Icon: FunctionComponent<
    AccessibleIcon & {
      transform?: string
    }
  >
  testID?: string
}
export const IconRetryStep: FunctionComponent<IconStepRetryProps> = ({ Icon, testID }) => {
  const theme = useTheme()

  return (
    <Container testID={testID}>
      <Icon size={theme.icons.sizes.standard} />
      <IconContainer>
        <StyledTryAgain />
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
  width: getSpacing(9),
  height: getSpacing(8.5),
})

const StyledTryAgain = styled(TryAgain).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
