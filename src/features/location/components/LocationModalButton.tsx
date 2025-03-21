import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { IconColorKey, TextColorKey } from 'theme/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports

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
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button">
      <TopContainer>
        <Icon color={theme.designSystem.color.icon[color]} size={theme.icons.sizes.small} />
        <Spacer.Row numberOfSpaces={2} />
        <Typo.Button color={color}>{title}</Typo.Button>
      </TopContainer>
      {subtitle ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={1} />
          <StyledCaption>{subtitle}</StyledCaption>
        </React.Fragment>
      ) : null}
    </TouchableOpacity>
  )
}

const TopContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
