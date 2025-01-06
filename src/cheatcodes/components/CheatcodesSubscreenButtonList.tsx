import React from 'react'

import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { ButtonsWithSubscreensProps } from 'cheatcodes/types'

interface Props {
  buttons: ButtonsWithSubscreensProps[]
}

export const CheatcodesSubscreensButtonList: React.FC<Props> = ({ buttons }) => (
  <React.Fragment>
    {buttons.map((button, index) =>
      button.subscreens?.map((subscreen, subIndex) => (
        <LinkToScreen
          key={`${index}-${subIndex}`}
          title={subscreen.title ?? subscreen.screen ?? '[sans titre]'}
          screen={subscreen.screen}
          onPress={subscreen.onPress}
          navigationParams={subscreen.navigationParams}
        />
      ))
    )}
  </React.Fragment>
)
