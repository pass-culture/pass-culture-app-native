import React from 'react'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'

type Props = {
  buttons: CheatcodeCategory[]
}

/**
 * Renders a list of cheatcode categories.
 * If a category contains subscreens (e.g., from a search result),
 * it will render those as indented secondary buttons.
 */
export const CheatcodesButtonList: React.FC<Props> = ({ buttons }) => (
  <React.Fragment>
    {buttons.map((category) => (
      <React.Fragment key={category.id}>
        <LinkToCheatcodesScreen button={category} variant="primary" />

        {category.subscreens.map((subscreen) => (
          <LinkToCheatcodesScreen
            key={subscreen.id}
            button={{ ...subscreen, title: `↳ ${subscreen.title}` }}
            variant="primary"
          />
        ))}
      </React.Fragment>
    ))}
  </React.Fragment>
)
