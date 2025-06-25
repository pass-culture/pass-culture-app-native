import React from 'react'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeButton } from 'cheatcodes/types'

interface Props {
  buttons: CheatcodeButton[]
}

/**
 * Renders a list of cheatcode buttons on a sub-screen.
 * This component's responsibility is purely to render what it's given.
 */
export const CheatcodesSubscreensButtonList: React.FC<Props> = ({ buttons }) => (
  <React.Fragment>
    {buttons.map((button) => (
      <LinkToCheatcodesScreen key={button.id} button={button} variant="secondary" />
    ))}
  </React.Fragment>
)
