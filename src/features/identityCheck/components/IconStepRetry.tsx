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
export const IconStepRetry: FunctionComponent<IconStepRetryProps> = ({ Icon, testID }) => {
  const { icons, designSystem } = useTheme()

  return (
    <Container testID={testID}>
      <Icon size={icons.sizes.standard} color={designSystem.color.icon.brandPrimary} />
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

const Container = styled.View(({ theme }) => ({
  width: getSpacing(9),
  height: theme.designSystem.size.spacing.xxl,
}))

const StyledTryAgain = styled(TryAgain).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.error,
}))``
