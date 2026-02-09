import React from 'react'
import styled from 'styled-components/native'

import { CheatcodeButton, CheatcodeCategory } from 'cheatcodes/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
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
  const { title, onPress, navigationTarget } = button
  return (
    <Row>
      {onPress ? (
        // Case 1: It's an ActionButton
        <Button wording={title} onPress={onPress} variant={variant} />
      ) : navigationTarget ? (
        // Case 2: It's a NavigationButton
        <InternalTouchableLink
          as={Button}
          wording={title}
          navigateTo={navigationTarget}
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
