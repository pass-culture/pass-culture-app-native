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
  paddingVertical: theme.designSystem.size.spacing.xxs,
}))

const IconWrapper = styled.View(({ theme }) => ({
  flexShrink: 0,
  marginRight: theme.designSystem.size.spacing.m,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginLeft: theme.designSystem.size.spacing.s,
}))
