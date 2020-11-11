import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, ScrollView } from 'react-native'

import { _ } from 'libs/i18n'
import { SafeContainer } from 'ui/components/SafeContainer'
import { Spacer } from 'ui/theme'

import { CheatCodesButton } from '../components/CheatCodesButton'

export function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <SafeContainer>
      <ScrollView>
        <Spacer.Column numberOfSpaces={5} />
        <Button title={_(t`Page Login`)} onPress={() => navigation.navigate('Login')} />
        <Spacer.Column numberOfSpaces={5} />
        <CheatCodesButton />
      </ScrollView>
    </SafeContainer>
  )
}
