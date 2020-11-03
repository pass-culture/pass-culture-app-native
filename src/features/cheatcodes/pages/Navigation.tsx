import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, ScrollView } from 'react-native'

import { _ } from 'libs/i18n'
import { Spacer } from 'ui/theme'

function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <ScrollView>
      <Spacer.Column numberOfSpaces={5} />
      <Button title={_(t`Page Login`)} onPress={() => navigation.navigate('Login')} />
      <Spacer.Column numberOfSpaces={5} />
    </ScrollView>
  )
}

export default Navigation
