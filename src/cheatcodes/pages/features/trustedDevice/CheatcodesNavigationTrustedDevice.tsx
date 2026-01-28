import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'

const trustedDeviceCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Trusted device 📱',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationTrustedDevice' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Infos sur l’appareil de confiance',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenTrustedDeviceInfos' },
      },
    },
    {
      id: uuidv4(),
      title: 'Choix de suspension',
      navigationTarget: { screen: 'SuspensionChoice' },
    },
    {
      id: uuidv4(),
      title: 'Lien de suspension expiré',
      navigationTarget: { screen: 'SuspensionChoiceExpiredLink' },
    },
    {
      id: uuidv4(),
      title: 'Compte suspendu (connexion suspecte)',
      navigationTarget: { screen: 'SuspiciousLoginSuspendedAccount' },
    },
    { id: uuidv4(), title: 'AccountSecurity', showOnlyInSearch: true },
    { id: uuidv4(), title: 'AccountSecurityBuffer', showOnlyInSearch: true },
  ],
}

export const cheatcodesNavigationTrustedDeviceButtons: CheatcodeCategory[] = [
  trustedDeviceCheatcodeCategory,
]

export function CheatcodesNavigationTrustedDevice(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const [value, setValue] = useState('')
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToAccountSecurityBuffer = () => {
    navigate('AccountSecurityBuffer', { ...ROUTE_PARAMS, token: value })
  }

  const visibleSubscreens = trustedDeviceCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={trustedDeviceCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      <LinkToCheatcodesScreen
        key="account-security-link"
        button={{
          id: uuidv4(),
          title: 'AccountSecurity',
          navigationTarget: { screen: 'AccountSecurity', params: ROUTE_PARAMS },
        }}
        variant="secondary"
      />

      <BufferContainer gap={2}>
        <ButtonPrimary
          wording="AccountSecurityBuffer"
          onPress={navigateToAccountSecurityBuffer}
          disabled={value.length < 1}
        />
        <TextInput onChangeText={setValue} label="Token" />
      </BufferContainer>
    </CheatcodesTemplateScreen>
  )
}

const BufferContainer = styled(ViewGap)(({ theme }) => ({
  borderWidth: theme.designSystem.size.spacing.xxs,
  borderColor: theme.designSystem.color.border.default,
  borderRadius: theme.designSystem.size.borderRadius.xl,
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  padding: theme.designSystem.size.spacing.s,
}))
