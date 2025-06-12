import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const cheatcodesNavigationTrustedDeviceButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Trusted device 📱',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationTrustedDevice' },
    subscreens: [
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenTrustedDeviceInfos' },
      },
      { screen: 'SuspensionChoice' },
      { screen: 'SuspensionChoiceExpiredLink' },
      { screen: 'SuspiciousLoginSuspendedAccount' },
      { title: 'AccountSecurity', showOnlyInSearch: true },
      { title: 'AccountSecurityBuffer', showOnlyInSearch: true },
    ],
  },
]

export function CheatcodesNavigationTrustedDevice(): React.JSX.Element {
  const [value, setValue] = useState('')
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToAccountSecurityBuffer = () => {
    navigate('AccountSecurityBuffer', { ...ROUTE_PARAMS, token: value })
  }

  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationTrustedDeviceButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationTrustedDeviceButtons} />

      <LinkToCheatcodesScreen screen="AccountSecurity" navigationParams={ROUTE_PARAMS} />

      <BufferContainer gap={2}>
        <ButtonPrimary
          wording="AccountSecurityBuffer"
          onPress={navigateToAccountSecurityBuffer}
          disabled={value.length < 1}
        />
        <TextInput onChangeText={setValue} placeholder="Rentrer un token pour activer le bouton" />
      </BufferContainer>
    </CheatcodesTemplateScreen>
  )
}

const BufferContainer = styled(ViewGap)(({ theme }) => ({
  borderWidth: getSpacing(0.5),
  borderColor: theme.colors.greyMedium,
  borderRadius: getSpacing(5),
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  padding: getSpacing(2),
}))
