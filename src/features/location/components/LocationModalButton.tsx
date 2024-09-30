import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface LocationModalButtonProps {
  icon: FunctionComponent<AccessibleIcon>
  color?: ColorsEnum
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
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button">
      <TopContainer>
        <Icon color={color} size={theme.icons.sizes.small} />
        <Spacer.Row numberOfSpaces={2} />
        <StyledButtonText color={color}>{title}</StyledButtonText>
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

const StyledButtonText = styled(TypoDS.Button)<{ color?: ColorsEnum }>(({ color }) => ({
  color: color,
}))

const StyledCaption = styled(TypoDS.BodySemiBoldXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
