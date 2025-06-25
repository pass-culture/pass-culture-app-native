// cheatcodes/components/CheatcodesButtonList.tsx (Refactored)

import React from 'react'
import styled from 'styled-components/native'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// --- Import our new category type ---
import { CheatcodeCategory } from 'cheatcodes/types'
import { getSpacing } from 'ui/theme'

// --- Props are now typed to our robust CheatcodeCategory ---
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
        {/* Render the main category button */}
        <LinkToCheatcodesScreen button={category} variant="primary" />

        {/* 
          If there are subscreens (only happens when searching),
          render them as indented secondary buttons.
        */}
        {category.subscreens.map((subscreen) => (
          <SubscreenContainer key={subscreen.id}>
            <LinkToCheatcodesScreen
              // Pass a modified button object to add the search result indicator
              button={{ ...subscreen, title: `↳ ${subscreen.title}` }}
              variant="secondary"
            />
          </SubscreenContainer>
        ))}
      </React.Fragment>
    ))}
  </React.Fragment>
)

const SubscreenContainer = styled.View({
  paddingLeft: getSpacing(4),
})
