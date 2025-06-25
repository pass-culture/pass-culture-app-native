import React from 'react'
import styled from 'styled-components/native'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getSpacing } from 'ui/theme'

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
          <SubscreenContainer key={subscreen.id}>
            <LinkToCheatcodesScreen
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
