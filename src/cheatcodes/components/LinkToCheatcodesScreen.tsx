// cheatcodes/components/LinkToCheatcodesScreen.tsx (Refactored)

import React from 'react'
import styled from 'styled-components/native'

// --- Import our new, clean types ---
import { CheatcodeButton, CheatcodeCategory } from 'cheatcodes/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { padding } from 'ui/theme'

// --- The props are now much cleaner ---
interface Props {
  // It accepts a single, structured object. No more loose props!
  button: CheatcodeButton | CheatcodeCategory
  // A 'variant' prop is clearer than 'isSubscreen' and 'buttonHeight'
  variant?: 'primary' | 'secondary'
}

/**
 * Renders a single, tappable cheatcode link.
 * It intelligently decides whether to render an action button (onPress)
 * or a navigation button (navigationTarget) based on the button prop.
 */
export const LinkToCheatcodesScreen = ({ button, variant = 'primary' }: Props) => {
  // Use a more descriptive button component based on the variant
  const ButtonComponent = variant === 'secondary' ? ButtonSecondary : ButtonPrimary

  // Destructure the clean properties from our button object.
  // The title is guaranteed to exist!
  const { title, onPress, navigationTarget } = button

  const buttonHeight = variant === 'secondary' ? 'extraSmall' : 'small'

  return (
    <Row>
      {/* The logic is now a clean if/else if/else based on the button's type */}
      {onPress ? (
        // Case 1: It's an ActionButton
        <ButtonComponent wording={title} onPress={onPress} buttonHeight={buttonHeight} />
      ) : navigationTarget ? (
        // Case 2: It's a NavigationButton
        <InternalTouchableLink
          as={ButtonComponent}
          wording={title}
          // The navigationTarget object is passed directly!
          navigateTo={navigationTarget}
          buttonHeight={buttonHeight}
        />
      ) : (
        // Case 3: It's a ContainerButton (no action) - render it disabled
        <ButtonComponent wording={title} disabled buttonHeight={buttonHeight} />
      )}
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  ...padding(2, 0.5),
}))
