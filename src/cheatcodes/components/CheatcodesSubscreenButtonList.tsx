import React from 'react'

import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

interface Props {
  buttons: CheatcodesButtonsWithSubscreensProps[]
}

export const CheatcodesSubscreensButtonList: React.FC<Props> = ({ buttons }) => (
  <React.Fragment>
    {buttons.map((button, index) =>
      button.subscreens?.map((subscreen, subIndex) =>
        subscreen.showOnlyInSearch ? null : (
          <LinkToScreen
            key={`${index}-${subIndex}`}
            title={subscreen.title ?? subscreen.screen ?? '[sans titre]'}
            screen={subscreen.screen}
            onPress={subscreen.onPress}
            navigationParams={subscreen.navigationParams}
            disabled={subscreen.showOnlyInSearch ?? false}
          />
        )
      )
    )}
  </React.Fragment>
)
