import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import { Button, StyleSheet, View, Text } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { i18n } from 'libs/i18n'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

type Props = {
  navigation: HomeScreenNavigationProp
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

export const Home: FunctionComponent<Props> = function ({ navigation }) {
  const goToLoginPage = useCallback((): void => {
    navigation.navigate('Login')
  }, [])
  const goToLoginPageWithParams = useCallback((): void => {
    navigation.navigate('Login', { userId: 'I have been Set by params' })
  }, [])

  return (
    <View style={styles.container}>
      <Text>{i18n._(/*i18n: Welcome message on Home page*/ t`Welcome to BAM!`)}</Text>
      <Button
        testID="loginButton"
        title={i18n._(/*i18n: Title of the go to login button*/ t`Go to Login Page`)}
        onPress={goToLoginPage}
      />
      <Button
        title={i18n._(
          /*i18n: Title of the go to login with params button*/ t`Go to Login Page with Params`
        )}
        onPress={goToLoginPageWithParams}
      />
    </View>
  )
}
