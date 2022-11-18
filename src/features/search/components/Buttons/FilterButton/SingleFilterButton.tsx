import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Check } from 'ui/svg/icons/Check'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type IsSelectedProps = {
  isSelected: boolean
}

export type SingleFilterButtonProps = IsSelectedProps & {
  label: string
  testID?: string
  onPress: () => void
  children?: never
}

export const SingleFilterButton: FunctionComponent<SingleFilterButtonProps> = ({
  label,
  isSelected,
  onPress,
  testID,
}) => {
  const filterButtonIcon = testID ? `${testID}Icon` : 'filterButtonIcon'
  const filterButtonLabel = testID ? `${testID}Label` : 'filterButtonLabel'

  return (
    <TouchableContainer isSelected={isSelected} onPress={onPress} testID={testID}>
      <Label isSelected={isSelected} testID={filterButtonLabel}>
        {label}
      </Label>
      {!!isSelected && (
        <React.Fragment>
          <Spacer.Row numberOfSpaces={1} />
          <StyledIcon testID={filterButtonIcon} accessibilityLabel="Filtre sélectionné" />
        </React.Fragment>
      )}
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
  paddingTop: getSpacing(1.5),
  paddingBottom: getSpacing(1.5),
  height: getSpacing(8),
  borderColor: isSelected ? theme.colors.primary : theme.colors.black,
  borderWidth: getSpacing(0.25),
  borderRadius: theme.borderRadius.button,
  ...customFocusOutline({ color: theme.colors.accent }),
  ...getHoverStyle(isSelected ? theme.colors.primary : theme.colors.black),
}))

const StyledIcon = styled(Check).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.primary,
}))``

const Label = styled(Typo.Caption)<IsSelectedProps>(({ theme, isSelected }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))
