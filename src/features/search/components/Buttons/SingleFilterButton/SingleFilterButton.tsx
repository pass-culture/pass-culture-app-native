import React, { FunctionComponent, ReactElement } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, TypoDS } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type IsSelectedProps = {
  isSelected: boolean
}

type SingleFilterButtonProps = IsSelectedProps & {
  label: string
  testID?: string
  icon?: ReactElement
  onPress: () => void
  children?: never
}

export const SingleFilterButton: FunctionComponent<SingleFilterButtonProps> = ({
  label,
  isSelected,
  onPress,
  icon,
  testID,
}) => {
  const filterButtonLabel = testID ? `${testID}Label` : 'filterButtonLabel'

  const accessibilityLabel = isSelected ? `${label}\u00a0: Filtre sélectionné` : label
  return (
    <TouchableContainer
      isSelected={isSelected}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}>
      <Label testID={filterButtonLabel}>{label}</Label>
      {icon}
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<IsSelectedProps>(({ theme, isSelected }) => ({
  flexDirection: 'row-reverse', // For accessibility purposes, we switch the title and the icon in the DOM so the VoiceOver restitution makes sense.
  boxSizing: 'border-box',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(4),
  columnGap: getSpacing(1),
  height: getSpacing(8),
  backgroundColor: isSelected ? theme.colors.greyLight : theme.colors.white,
  borderColor: theme.colors.black,
  borderWidth: isSelected ? 2 : 1,
  borderRadius: theme.borderRadius.button,
  ...customFocusOutline({ color: theme.colors.accent }),
  ...getHoverStyle(theme.colors.black),
}))

const Label = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.black,
}))
