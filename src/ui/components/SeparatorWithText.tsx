import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

interface SeparatorWithTextProps {
  label: string
  icon?: FunctionComponent<AccessibleIcon>
  color?: 'neutral' | 'primary'
}

export const SeparatorWithText: FunctionComponent<SeparatorWithTextProps> = ({
  label,
  icon: Icon,
  color,
}) => {
  const { designSystem, icons } = useTheme()
  const iconColor =
    color === 'primary' ? designSystem.color.text.brandPrimary : designSystem.color.text.default
  return (
    <Container>
      <StyledSeparator type="left" />
      {Icon ? (
        <IconContainer>
          <Icon size={icons.sizes.extraSmall} color={iconColor} />
        </IconContainer>
      ) : null}
      <StyledLabel color={color}>{label}</StyledLabel>
      <StyledSeparator type="right" />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xs,
}))

const StyledLabel = styled(Typo.BodyAccentS)<{ color?: 'neutral' | 'primary' }>(
  ({ theme, color }) => ({
    color:
      color === 'primary'
        ? theme.designSystem.color.text.brandPrimary
        : theme.designSystem.color.text.default,
  })
)

const StyledSeparator = styled(Separator.Horizontal)<{ type?: 'left' | 'right' }>(
  ({ theme, type }) => ({
    flex: 1,
    backgroundColor: theme.designSystem.separator.color.subtle,
    marginRight: type === 'left' ? theme.designSystem.size.spacing.l : undefined,
    marginLeft: type === 'right' ? theme.designSystem.size.spacing.l : undefined,
  })
)

const IconContainer = styled.View(({ theme }) => ({
  marginRight: theme.designSystem.size.spacing.xs,
}))
