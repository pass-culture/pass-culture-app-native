import { t } from '@lingui/macro'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Button, View, Text, StyleSheet } from 'react-native'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { RootStackParamList } from 'features/navigation/RootNavigator'
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
  const goToHomePage = (): void => {
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <Text>{_(t`Page de connexion`)}</Text>
      <Button testID="homepageButton" title={_(t`Aller sur la home page`)} onPress={goToHomePage} />
      <CheatCodesButton navigation={navigation} />
      <Text>{route.params && route.params.userId}</Text>
    </View>
  )
}
