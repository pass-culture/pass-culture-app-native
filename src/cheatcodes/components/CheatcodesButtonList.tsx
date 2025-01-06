import React from 'react'

import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { ButtonsWithSubscreensProps } from 'cheatcodes/types'

type Props = {
  buttons: ButtonsWithSubscreensProps[]
}

export const CheatcodesButtonList: React.FC<Props> = ({ buttons }) => (
  <React.Fragment>
    {buttons.map((button, index) => (
      <React.Fragment key={index}>
        <LinkToScreen
          title={button.title ?? button.screen}
          screen={button.screen}
          onPress={button.onPress}
          navigationParams={button.navigationParams}
        />
        {button.subscreens?.map((subscreen, subIndex) => (
          <LinkToScreen
            key={`${index}-${subIndex}`}
            title={`↳ ${subscreen.title ?? subscreen.screen ?? '[sans titre]'}`}
            screen={subscreen.screen}
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
