import React from 'react'
import styled from 'styled-components/native'

import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ProfileNavigateParams } from 'features/navigation/RootNavigator/types'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Typo } from 'ui/theme'

type EditableFieldProps = {
  label: string
  value?: string | null
  navigateTo?: ProfileNavigateParams[0]
  navigateParams?: ProfileNavigateParams[1]
  onBeforeNavigate?: () => void
  accessibilityLabel?: string
}

export function EditableField({
  label,
  value,
  navigateTo,
  navigateParams,
  onBeforeNavigate,
  accessibilityLabel,
}: EditableFieldProps) {
  const displayValue = value?.trim()
  const isCompleted = !!displayValue
  const showButton = !!navigateTo

  if (!displayValue && !navigateTo) return null

  return (
    <React.Fragment>
      <StyledBodyAccentXs>{label}</StyledBodyAccentXs>
      <EditContainer>
        {isCompleted ? (
          <EditText numberOfLines={2}>{displayValue}</EditText>
        ) : (
          <NoEditText>Non complété</NoEditText>
        )}
        {showButton ? (
          <EditButton
            navigateTo={getProfileNavConfig(navigateTo, navigateParams)}
            onPress={onBeforeNavigate}
            wording={isCompleted ? 'Modifier' : 'Compléter'}
            accessibilityLabel={accessibilityLabel}
          />
        ) : null}
      </EditContainer>
      <StyledSeparator />
    </React.Fragment>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const EditContainer = styled.View({
  marginTop: getSpacing(2),
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const EditText = styled(Typo.Body)({
  flexShrink: 1,
  marginRight: getSpacing(2),
})

const NoEditText = styled(Typo.BodyItalic)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
})
