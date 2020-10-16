import { t } from '@lingui/macro'
import CookieManager from '@react-native-community/cookies'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { Button, View, Text, TextInput, StyleSheet } from 'react-native'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

type Props = {
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
}
export const Login: FunctionComponent<Props> = function ({ navigation, route }) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  function goToHomePage(): void {
    return navigation.navigate('Home')
  }

  async function submitAuthForm(): Promise<void> {
    const config = {
      body: JSON.stringify({ identifier: email, password }),
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    }
    return await fetch(env.API_BASE_URL + '/beneficiaries/signin', config)
      .then((response) => {
        CookieManager.setFromResponse(env.API_BASE_URL, response.headers.map['set-cookie']).then(
          () => {
            goToHomePage()
          }
        )
      })
      .catch((err) => console.warn('failed to fetch token: ', err))
  }

  return (
    <View style={styles.container}>
      <Text>{_(t`Page de connexion`)}</Text>
      <Button testID="homepageButton" title={_(t`Aller sur la home page`)} onPress={goToHomePage} />
      <Text>{_(/*i18n: title of login page */ t`Login`)}</Text>
      <TextInput
        placeholder={_(/*i18n: email placeholder */ t`name@domain.com`)}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder={_(/*i18n: password placeholder */ t`password`)}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button
        title={_(/*i18n: title of authentication button */ t`Login`)}
        onPress={submitAuthForm}
      />
      <Button testID="homepageButton" title={_(t`Aller sur la home page`)} onPress={goToHomePage} />
      <CheatCodesButton navigation={navigation} />
      <Text>{route.params && route.params.userId}</Text>
    </View>
  )
}
