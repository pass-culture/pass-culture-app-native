import React from 'react'
import styled from 'styled-components/native'

import { CheatcodeButton, CheatcodeCategory } from 'cheatcodes/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { padding } from 'ui/theme'

interface Props {
  button: CheatcodeButton | CheatcodeCategory
  variant?: 'primary' | 'secondary'
}

/**
 * Renders a single, tappable cheatcode link.
 * It intelligently decides whether to render an action button (onPress)
 * or a navigation button (navigationTarget) based on the button prop.
 */
export const LinkToCheatcodesScreen = ({ button, variant = 'primary' }: Props) => {
  const ButtonComponent = variant === 'secondary' ? ButtonSecondary : ButtonPrimary

  const { title, onPress, navigationTarget } = button

  const buttonHeight = variant === 'secondary' ? 'extraSmall' : 'small'

  return (
    <Row>
      {onPress ? (
        // Case 1: It's an ActionButton
        <ButtonComponent wording={title} onPress={onPress} buttonHeight={buttonHeight} />
      ) : navigationTarget ? (
        // Case 2: It's a NavigationButton
        <InternalTouchableLink
          as={ButtonComponent}
          wording={title}
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
