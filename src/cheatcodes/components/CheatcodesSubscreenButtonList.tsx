import React from 'react'

import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { LinkToScreenWithNavigateTo } from 'cheatcodes/components/LinkToScreenWithNavigateTo'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

interface Props {
  buttons: CheatcodesButtonsWithSubscreensProps[]
}

export const CheatcodesSubscreensButtonList: React.FC<Props> = ({ buttons }) => {
  return (
    <React.Fragment>
      {buttons.map((button, index) =>
        button.subscreens?.map((subscreen, subIndex) => {
          if (subscreen.screen === 'TabNavigator')
            return (
              <LinkToScreenWithNavigateTo
                key={`${index}-${subIndex}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                title={(subscreen as any).params.params.screen as string}
                screen={subscreen.screen}
                navigateTo={subscreen as InternalNavigationProps['navigateTo']}
                disabled={subscreen.showOnlyInSearch ?? false}
              />
            )

          return (
            <LinkToCheatcodesScreen
              key={`${index}-${subIndex}`}
              title={subscreen.title ?? subscreen.screen ?? '[sans titre]'}
              screen={subscreen.screen}
              onPress={subscreen.onPress}
              navigationParams={subscreen.navigationParams}
              disabled={subscreen.showOnlyInSearch ?? false}
            />
          )
        })
      )}
    </React.Fragment>
  )
}
