import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import { Button, StyleSheet, View, Text, ActivityIndicator } from 'react-native'

import { useCurrentUser } from 'features/auth/api'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { useGeolocation, CoordinatesView } from 'libs/geolocation'
import { _ } from 'libs/i18n'

import { CodePushButton } from '../components/CodePushButton'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

type Props = {
  navigation: HomeScreenNavigationProp
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  geolocation: { position: 'absolute', alignItems: 'center', bottom: 50 },
  userInformations: { alignItems: 'center', paddingVertical: 20 },
})

export const Home: FunctionComponent<Props> = function ({ navigation }) {
  const position = useGeolocation()
  const { email, isFetching, refetch, isError } = useCurrentUser()

  const goToLoginPageWithParams = useCallback((): void => {
    navigation.navigate('Login', { userId: 'I have been Set by params' })
  }, [])

  const refetchUserInformations = useCallback((): void => void refetch(), [])

  return (
    <View style={styles.container}>
      <Text>{_(t`Bienvenue à Pass Culture`)}</Text>
      <Button
        title={_(t`Aller sur la page de connexion avec params`)}
        onPress={goToLoginPageWithParams}
      />
      {isFetching && <ActivityIndicator testID="user-activity-indicator" />}
      {email && !isError && (
        <View style={styles.userInformations}>
          <Text>{`EMAIL: ${email}`}</Text>
          <Button
            title={_(t`Rafraîchir les données de l'utilisateur`)}
            onPress={refetchUserInformations}
            testID="refreshUserInformationsButton"
          />
        </View>
      )}
      <CoordinatesView position={position} style={styles.geolocation} />
      {env.FEATURE_FLAG_CODE_PUSH_MANUAL && <CodePushButton />}
    </View>
  )
}
