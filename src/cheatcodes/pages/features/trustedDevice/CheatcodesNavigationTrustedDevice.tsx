import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Spacer, getSpacing } from 'ui/theme'

export function CheatcodesNavigationTrustedDevice(): React.JSX.Element {
  const [value, setValue] = useState('')
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToAccountSecurityBuffer = () => {
    navigate('AccountSecurityBuffer', { ...ROUTE_PARAMS, token: value })
  }

  return (
    <CheatcodesTemplateScreen title="Trusted device 📱">
      <LinkToComponent name="CheatcodesScreenTrustedDeviceInfos" />
      <LinkToComponent name="SuspensionChoice" />
      <LinkToComponent name="SuspensionChoiceExpiredLink" />
      <LinkToComponent name="SuspiciousLoginSuspendedAccount" />
      <LinkToComponent name="AccountSecurity" navigationParams={ROUTE_PARAMS} />
      <BufferContainer>
        <ButtonPrimary
          wording="AccountSecurityBuffer"
          onPress={navigateToAccountSecurityBuffer}
          disabled={value.length < 1}
        />
        <Spacer.Column numberOfSpaces={2} />
        <TextInput onChangeText={setValue} placeholder="Rentrer un token pour activer le bouton" />
      </BufferContainer>
    </CheatcodesTemplateScreen>
  )
}

const BufferContainer = styled.View(({ theme }) => ({
  borderWidth: getSpacing(0.5),
  borderColor: theme.colors.greyMedium,
  borderRadius: getSpacing(5),
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  padding: getSpacing(2),
}))
