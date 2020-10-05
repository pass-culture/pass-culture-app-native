import { t } from '@lingui/macro'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Button, View, Text, StyleSheet } from 'react-native'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { i18n } from 'libs/i18n'

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
      <Text>{i18n._(/*i18n: The title of the login page */ t`Login page`)}</Text>
      <Button
        testID="homepageButton"
        title={i18n._(/*i18n: The title of button to go to the home page */ t`Go to Home Page`)}
        onPress={goToHomePage}
      />
      <CheatCodesButton navigation={navigation} />
      <Text>{route.params && route.params.userId}</Text>
    </View>
  )
}
