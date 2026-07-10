import React from 'react'
import styled from 'styled-components/native'

import { CheatcodeButton, CheatcodeCategory } from 'cheatcodes/types'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { AUTH_PROTECTED_PROFILE_SCREENS } from 'features/navigation/navigators/ProfileStackNavigator/ProfileStackNavigator'
import { AUTH_PROTECTED_SUBSCRIPTION_SCREENS } from 'features/navigation/navigators/SubscriptionStackNavigator/SubscriptionStackNavigator'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { padding } from 'ui/theme'

interface Props {
  button: CheatcodeButton | CheatcodeCategory
  variant?: 'primary' | 'secondary'
}

type NavigationTarget = CheatcodeButton['navigationTarget'] | CheatcodeCategory['navigationTarget']

const AUTH_PROTECTED_NESTED_SCREENS_BY_STACK = new Map<string, ReadonlySet<string>>([
  ['SubscriptionStackNavigator', AUTH_PROTECTED_SUBSCRIPTION_SCREENS],
  ['ProfileStackNavigator', AUTH_PROTECTED_PROFILE_SCREENS],
])

const hasNestedScreen = (params) =>
  typeof params === 'object' && params !== null && 'screen' in params

const getNestedScreen = (params) => (hasNestedScreen(params) ? params.screen : undefined)

const getProtectedNavigationTarget = ({
  isLoggedIn,
  navigationTarget,
}: {
  isLoggedIn: boolean
  navigationTarget?: NavigationTarget
}): NavigationTarget => {
  if (!navigationTarget) return undefined
  if (isLoggedIn) return navigationTarget

  const protectedNestedScreens = AUTH_PROTECTED_NESTED_SCREENS_BY_STACK.get(navigationTarget.screen)
  const params = 'params' in navigationTarget ? navigationTarget.params : undefined
  const nestedScreen = getNestedScreen(params)

  if (nestedScreen && protectedNestedScreens?.has(nestedScreen)) return { screen: 'Login' }
  return navigationTarget
}

/**
 * Renders a single, tappable cheatcode link.
 * It intelligently decides whether to render an action button (onPress)
 * or a navigation button (navigationTarget) based on the button prop.
 */
export const LinkToCheatcodesScreen = ({ button, variant = 'primary' }: Props) => {
  const { isLoggedIn } = useAuthContext()
  const { title, onPress, navigationTarget } = button
  const protectedNavigationTarget = getProtectedNavigationTarget({ isLoggedIn, navigationTarget })

  return (
    <Row>
      {onPress ? (
        // Case 1: It's an ActionButton
        <Button wording={title} onPress={onPress} variant={variant} />
      ) : protectedNavigationTarget ? (
        // Case 2: It's a NavigationButton
        <InternalTouchableLink
          as={Button}
          wording={title}
          navigateTo={protectedNavigationTarget}
          variant={variant}
        />
      ) : (
        // Case 3: It's a ContainerButton (no action) - render it disabled
        <Button wording={title} disabled variant={variant} />
      )}
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  ...padding(2, 0.5),
}))
