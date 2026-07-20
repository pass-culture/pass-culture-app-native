import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { OfferCtaScreen } from 'features/offerCtaPoc/pages/OfferCtaScreen'

const offerCtaPocCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Offer CTA POC 🎯',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationOfferCtaPoc' },
  },
  subscreens: [],
}

export const cheatcodesNavigationOfferCtaPocButtons: CheatcodeCategory[] = [
  offerCtaPocCheatcodeCategory,
]

export function CheatcodesNavigationOfferCtaPoc(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen
      title={offerCtaPocCheatcodeCategory.title}
      flexDirection="column"
      onGoBack={goBack}>
      <OfferCtaScreen />
    </CheatcodesTemplateScreen>
  )
}
