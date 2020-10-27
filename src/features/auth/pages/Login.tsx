import { t } from '@lingui/macro'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Button, View, Text, TextInput, StyleSheet } from 'react-native'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { ColorsEnum } from 'ui/theme'

import { signin } from '../api'

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

type Props = {
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
}

let INITIAL_IDENTIFIER = ''
let INITIAL_PASSWORD = ''

if (__DEV__) {
  INITIAL_IDENTIFIER = env.SIGNIN_IDENTIFIER
  INITIAL_PASSWORD = env.SIGNIN_PASSWORD
}

export const Login: FunctionComponent<Props> = function (props: Props) {
  const [email, setEmail] = useState(INITIAL_IDENTIFIER)
  const [password, setPassword] = useState(INITIAL_PASSWORD)

  async function handleSignin() {
    const isSigninSuccessful = await signin({ email, password })
    if (isSigninSuccessful) {
      props.navigation.navigate('Home')
    }
  }

  return (
    <View style={styles.container}>
      <Text>{_(t`Connectez-vous :`)}</Text>
      <TextInput
        style={styles.input}
        placeholder={_(/*i18n: email placeholder */ t`name@domain.com`)}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={_(/*i18n: password placeholder */ t`password`)}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title={_(/*i18n: login button */ t`Connexion`)} onPress={handleSignin} />
      <CheatCodesButton navigation={props.navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  input: { borderColor: ColorsEnum.BLACK, borderWidth: 1 },
})
