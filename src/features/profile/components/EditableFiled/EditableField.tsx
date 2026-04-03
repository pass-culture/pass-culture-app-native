import React from 'react'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { ProfileNavigateParams } from 'features/navigation/RootNavigator/types'
import { EditButton } from 'features/profile/components/Buttons/EditButton/EditButton'
import { Separator } from 'ui/components/Separator'
import { Typo } from 'ui/theme'

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
        <ValueContainer>
          {isCompleted ? (
            <EditText numberOfLines={3}>{displayValue}</EditText>
          ) : (
            <NoEditText>Non complété</NoEditText>
          )}
        </ValueContainer>
        {showButton ? (
          <ButtonContainer>
            <EditButton
              navigateTo={getProfilePropConfig(navigateTo, navigateParams)}
              onPress={onBeforeNavigate}
              wording={isCompleted ? 'Modifier' : 'Compléter'}
              accessibilityLabel={accessibilityLabel}
            />
          </ButtonContainer>
        ) : null}
      </EditContainer>
      <StyledSeparator />
    </React.Fragment>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const EditContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
  flexDirection: 'row',
  alignItems: 'flex-start',
}))

const ValueContainer = styled.View({
  flex: 1,
  minWidth: 0,
})

const ButtonContainer = styled.View(({ theme }) => ({
  flexShrink: 0,
  marginLeft: theme.designSystem.size.spacing.s,
}))

const EditText = styled(Typo.Body)({
  flexShrink: 1,
})

const NoEditText = styled(Typo.BodyItalic)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
