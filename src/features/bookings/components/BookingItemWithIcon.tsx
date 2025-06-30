import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export const Item: React.FC<{
  Icon: React.FC<AccessibleIcon>
  message: React.JSX.Element | string
  subtext?: string
  testID?: string
}> = ({ Icon, message, subtext = '', testID }) => {
  const { designSystem, icons } = useTheme()
  return (
    <Row testID={testID}>
      <IconWrapper>
        <Icon color={designSystem.color.icon.subtle} size={icons.sizes.small} />
      </IconWrapper>
      {typeof message === 'string' ? <Typo.BodyAccentXs>{message}</Typo.BodyAccentXs> : message}
      <StyledBodyAccentXs>{subtext}</StyledBodyAccentXs>
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: theme.appContentWidth - getSpacing(24),
  paddingVertical: getSpacing(0.5),
}))

const IconWrapper = styled.View({
  flexShrink: 0,
  marginRight: getSpacing(3),
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginLeft: getSpacing(2),
}))
