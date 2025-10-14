import React from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  const { icons, designSystem } = useTheme()
  return (
    <Container gap={2}>
      <IconContainer>
        <Icon
          accessibilityLabel={accessibilityLabel}
          testID={testID}
          color={designSystem.color.icon.subtle}
          size={icons.sizes.standard}
        />
      </IconContainer>
      <Caption testID={testID ? `caption-${testID}` : undefined} disabled={isDisabled}>
        {caption}
      </Caption>
    </Container>
  )
}

const Container = styled(ViewGap)({
  alignItems: 'center',
})

const IconContainer = styled.View({
  padding: getSpacing(1),
})

const Caption = styled(Typo.BodyAccentXs)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.default,
  textAlign: 'center',
}))
