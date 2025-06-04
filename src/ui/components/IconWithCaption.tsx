import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface IconWithCaptionProps {
  Icon: React.FC<AccessibleIcon>
  caption: string
  accessibilityLabel?: string
  testID?: string
  isDisabled?: boolean
}

export const IconWithCaption = ({
  Icon,
  caption,
  accessibilityLabel,
  testID,
  isDisabled = false,
}: IconWithCaptionProps) => {
  const StyledIcon = styled(Icon).attrs(({ theme, size }) => ({
    size: size ?? theme.icons.sizes.standard,
    color: theme.colors.greyDark,
  }))``

  return (
    <Container gap={2}>
      <IconContainer>
        <StyledIcon accessibilityLabel={accessibilityLabel} testID={testID} />
      </IconContainer>
      <Caption testID={testID ? `caption-${testID}` : undefined} disabled={isDisabled}>
        {caption}
      </Caption>
    </Container>
  )
}

const Container = styled(ViewGap)({
  flex: 1,
  alignItems: 'center',
})

const IconContainer = styled.View({
  padding: getSpacing(1),
})

const Caption = styled(Typo.BodyAccentXs)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.default,
  textAlign: 'center',
}))
