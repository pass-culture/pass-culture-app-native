import { useNavigation } from '@react-navigation/core'
import React from 'react'

import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { CheatcodesButtonProps, CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'

interface Props {
  buttons: CheatcodesButtonsWithSubscreensProps[]
}

export const CheatcodesSubscreensButtonList: React.FC<Props> = ({ buttons }) => {
  const { navigate } = useNavigation()

  return (
    <React.Fragment>
      {buttons.map((button, index) =>
        button.subscreens?.map((subscreen, subIndex) => {
          return (
            <LinkToScreen
              key={`${index}-${subIndex}`}
              title={getTitle(subscreen)}
              screen={subscreen.screen}
              onPress={getOnPress(subscreen)}
              navigationParams={getParams(subscreen)}
              disabled={subscreen.showOnlyInSearch ?? false}
            />
          )
        })
      )}
    </React.Fragment>
  )
  function getTitle(subscreen: CheatcodesButtonProps): string | undefined {
    if (subscreen.screen === 'TabNavigator') return subscreen.params.params.screen
    return subscreen.title ?? subscreen.screen ?? '[sans titre]'
  }
  function getParams(subscreen: CheatcodesButtonProps) {
    if (subscreen.screen === 'TabNavigator') return subscreen.screen
    return subscreen.navigationParams
  }
  function getOnPress(subscreen: CheatcodesButtonProps): (() => void) | undefined {
    if (subscreen.screen === 'TabNavigator')
      return () => navigate(...getProfileStackConfig(subscreen.params.params.screen))
    return subscreen.onPress
  }
}
