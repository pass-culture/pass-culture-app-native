import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { IconColorKey, TextColorKey } from 'theme/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

interface LocationModalButtonProps {
  icon: FunctionComponent<AccessibleIcon>
  color: TextColorKey & IconColorKey
  title: string
  subtitle?: string
  onPress: () => void
}

export const LocationModalButton = ({
  icon: Icon,
  color,
  title,
  subtitle,
  onPress,
}: LocationModalButtonProps) => {
  const { designSystem, icons } = useTheme()
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole={AccessibilityRole.BUTTON}>
      <TopContainer gap={2}>
        <Icon color={designSystem.color.icon[color]} size={icons.sizes.small} />
        <Typo.Button color={color}>{title}</Typo.Button>
      </TopContainer>
      {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
    </TouchableOpacity>
  )
}

const TopContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginTop: theme.designSystem.size.spacing.xs,
}))
