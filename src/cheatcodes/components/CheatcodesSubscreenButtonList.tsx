// src/cheatcodes/components/CheatcodesSubscreenButtonList.tsx (Corrected)

import React from 'react'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// Import our new, clean button type
import { CheatcodeButton } from 'cheatcodes/types'

// The props are correct: a flat array of buttons to render
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
      // --- THE FIX IS HERE ---
      // We now pass the entire `button` object as a single prop.
      // We also use the `variant` prop to give these buttons a distinct style,
      // which is cleaner than the old `isSubscreen` boolean.
      <LinkToCheatcodesScreen key={button.id} button={button} variant="secondary" />
    ))}
  </React.Fragment>
)
