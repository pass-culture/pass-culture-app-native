import React from 'react'
import styled from 'styled-components/native'

import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonProps } from 'ui/pages/GenericInfoPage'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

const commonButtonProps = (button: ButtonProps) => ({
  wording: button.wording,
  isLoading: button.isLoading,
  disabled: button.disabled,
  icon: button.icon,
  accessibilityLabel: button.accessibilityLabel,
})

export const getGenericInfoPageButtons = ({
  buttonPrimary,
  buttonSecondary,
  buttonTertiary,
}: {
  buttonPrimary: ButtonProps
  buttonSecondary?: ButtonProps
  buttonTertiary?: ButtonProps
}) => {
  const onPressAccessibilityRole = accessibilityRoleInternalNavigation()

  return (
    <React.Fragment>
      {buttonPrimary.onPress ? (
        <Button
          fullWidth
          color="brand"
          key={1}
          onPress={buttonPrimary.onPress}
          accessibilityRole={buttonPrimary.accessibilityRole ?? onPressAccessibilityRole}
          {...commonButtonProps(buttonPrimary)}
        />
      ) : null}

      {buttonPrimary.navigateTo ? (
        <InternalTouchableLink
          key={1}
          as={Button}
          color="brand"
          fullWidth
          navigateTo={buttonPrimary.navigateTo}
          onBeforeNavigate={buttonPrimary.onBeforeNavigate}
          onAfterNavigate={buttonPrimary.onAfterNavigate}
          {...commonButtonProps(buttonPrimary)}
        />
      ) : null}

      {buttonPrimary.externalNav ? (
        <ExternalTouchableLink
          key={1}
          as={Button}
          color="brand"
          fullWidth
          externalNav={buttonPrimary.externalNav}
          onBeforeNavigate={buttonPrimary.onBeforeNavigate}
          onAfterNavigate={buttonPrimary.onAfterNavigate}
          {...commonButtonProps(buttonPrimary)}
          icon={ExternalSiteFilled}
        />
      ) : null}

      {buttonSecondary?.onPress ? (
        <Button
          fullWidth
          key={2}
          variant="secondary"
          color="neutral"
          onPress={buttonSecondary.onPress}
          accessibilityRole={buttonSecondary.accessibilityRole ?? onPressAccessibilityRole}
          {...commonButtonProps(buttonSecondary)}
        />
      ) : null}

      {buttonSecondary?.navigateTo ? (
        <InternalTouchableLink
          key={2}
          as={Button}
          fullWidth
          variant="secondary"
          navigateTo={buttonSecondary.navigateTo}
          onBeforeNavigate={buttonSecondary.onBeforeNavigate}
          onAfterNavigate={buttonSecondary.onAfterNavigate}
          {...commonButtonProps(buttonSecondary)}
        />
      ) : null}

      {buttonSecondary?.externalNav ? (
        <ExternalTouchableLink
          key={2}
          as={Button}
          fullWidth
          variant="secondary"
          externalNav={buttonSecondary.externalNav}
          onBeforeNavigate={buttonSecondary.onBeforeNavigate}
          onAfterNavigate={buttonSecondary.onAfterNavigate}
          {...commonButtonProps(buttonSecondary)}
          icon={ExternalSiteFilled}
        />
      ) : null}

      {buttonTertiary?.onPress ? (
        <TertiaryButtonContainer>
          <Button
            variant="tertiary"
            color="neutral"
            key={buttonTertiary ? 3 : 2}
            onPress={buttonTertiary.onPress}
            accessibilityRole={buttonTertiary.accessibilityRole ?? onPressAccessibilityRole}
            {...commonButtonProps(buttonTertiary)}
          />
        </TertiaryButtonContainer>
      ) : null}

      {buttonTertiary?.navigateTo ? (
        <TertiaryButtonContainer>
          <InternalTouchableLink
            key={buttonTertiary ? 3 : 2}
            as={Button}
            variant="tertiary"
            color="neutral"
            navigateTo={buttonTertiary.navigateTo}
            onBeforeNavigate={buttonTertiary.onBeforeNavigate}
            onAfterNavigate={buttonTertiary.onAfterNavigate}
            {...commonButtonProps(buttonTertiary)}
          />
        </TertiaryButtonContainer>
      ) : null}

      {buttonTertiary?.externalNav ? (
        <TertiaryButtonContainer>
          <ExternalTouchableLink
            key={buttonTertiary ? 3 : 2}
            as={Button}
            variant="tertiary"
            color="neutral"
            externalNav={buttonTertiary.externalNav}
            onBeforeNavigate={buttonTertiary.onBeforeNavigate}
            onAfterNavigate={buttonTertiary.onAfterNavigate}
            {...commonButtonProps(buttonTertiary)}
            icon={ExternalSiteFilled}
          />
        </TertiaryButtonContainer>
      ) : null}
    </React.Fragment>
  )
}

const TertiaryButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
