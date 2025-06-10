import React from 'react'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

type Props = {
  buttons: CheatcodesButtonsWithSubscreensProps[]
}

export const CheatcodesButtonList: React.FC<Props> = ({ buttons }) => (
  <React.Fragment>
    {buttons.map((button, index) => (
      <React.Fragment key={index}>
        <LinkToCheatcodesScreen
          title={button.title ?? button.screen}
          screen={button.screen}
          onPress={button.onPress}
          navigationParams={button.navigationParams}
        />
        {button.subscreens?.map((subscreen, subIndex) => (
          <LinkToCheatcodesScreen
            key={`${index}-${subIndex}`}
            title={`${subscreen.showOnlyInSearch ? '↳ ' : ''} ${subscreen.title ?? subscreen.screen ?? '[sans titre]'}`}
            screen={subscreen.showOnlyInSearch ? button.screen : subscreen.screen}
            onPress={subscreen.onPress}
            navigationParams={subscreen.navigationParams}
            buttonHeight="extraSmall"
            isSubscreen
          />
        ))}
      </React.Fragment>
    ))}
  </React.Fragment>
)
