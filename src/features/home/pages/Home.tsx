import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import { Button, Text, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { useCurrentUser } from 'features/auth/api'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { useGeolocation, CoordinatesView } from 'libs/geolocation'
import { i18n } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, Spacer, Typo, getSpacing } from 'ui/theme'

import { CodePushButton } from '../components/CodePushButton'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

type Props = {
  navigation: HomeScreenNavigationProp
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const CoordinatesViewContainer = styled(CoordinatesView)({
  position: 'absolute',
  alignItems: 'center',
  bottom: 50,
})

const UserInformationContainer = styled.View({
  alignItems: 'center',
  paddingVertical: getSpacing(5),
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
})

export const Home: FunctionComponent<Props> = function ({ navigation }) {
  const position = useGeolocation()
  const { email, isFetching, refetch, isError } = useCurrentUser()

  const goToLoginPageWithParams = useCallback((): void => {
    navigation.navigate('Login', { userId: 'I have been Set by params' })
  }, [])

  const refetchUserInformations = useCallback((): void => void refetch(), [])

  return (
    <Container>
      <HeaderBackgroundWrapper>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={18} />
      <Typo.Title1 color={ColorsEnum.WHITE}>
        {i18n._(/*i18n: Welcome title message */ t`Bienvenue !`)}
      </Typo.Title1>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Body color={ColorsEnum.WHITE}>
        {i18n._(/*i18n: Welcome body message */ t`Toute la culture dans votre main`)}
      </Typo.Body>
      <Spacer.Flex />
      <Text>{i18n._(t`Bienvenue à Pass Culture`)}</Text>
      <Button
        title={i18n._(t`Aller sur la page de connexion avec params`)}
        onPress={goToLoginPageWithParams}
      />
      {isFetching && <ActivityIndicator testID="user-activity-indicator" />}
      {email && !isError && (
        <UserInformationContainer>
          <Text>{`EMAIL: ${email}`}</Text>
          <Button
            title={i18n._(t`Rafraîchir les données de l'utilisateur`)}
            onPress={refetchUserInformations}
            testID="refreshUserInformationsButton"
          />
        </UserInformationContainer>
      )}
      <CoordinatesViewContainer position={position} />
      {env.FEATURE_FLAG_CODE_PUSH_MANUAL && <CodePushButton />}
      <Spacer.Flex />
    </Container>
  )
}
