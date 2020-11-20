import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Linking, ScrollView } from 'react-native'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SafeContainer } from 'ui/components/SafeContainer'
import { padding, Spacer } from 'ui/theme'

import { CheatCodesButton } from '../components/CheatCodesButton'
import { IdCheckButton } from '../components/IdCheckButton'

const MdpDeeplink =
  DEEPLINK_DOMAIN + 'mot-de-passe-perdu?token=etjkdfldkfsd&expiration_timestamp=4567894123450'
const BadDeeplink = DEEPLINK_DOMAIN + 'unknown'

export function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <SafeContainer noTabBarSpacing>
      <ScrollView>
        <StyledContainer>
          <Spacer.Column numberOfSpaces={2} />
          <Row half>
            <CheatCodesButton />
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row half>
            <IdCheckButton />
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row half>
            <ButtonPrimary title={'Login'} onPress={() => navigation.navigate('Login')} />
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row half>
            <ButtonPrimary
              title={'Reset Mdp'}
              onPress={() => {
                if (Linking.canOpenURL(MdpDeeplink)) {
                  Linking.openURL(MdpDeeplink)
                }
              }}
            />
          </Row>
          <Row>
            <ButtonPrimary
              title={'Reset Mdp : email envoyé'}
              onPress={() =>
                // TODO => PC-4356
                navigation.navigate('ResetPasswordEmailSent', {
                  email: 'jean.dupont@gmail.com',
                })
              }
            />
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row>
            <ButtonPrimary
              title={'Reset Mdp : lien expiré'}
              onPress={() =>
                navigation.navigate('ResetPasswordExpiredLink', {
                  email: 'jean.dupont@gmail.com',
                })
              }
            />
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row>
            <Text>Simulation email deeplink :</Text>
            <Link>
              <Text>{MdpDeeplink}</Text>
            </Link>
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row>
            <ButtonPrimary
              title={'Mauvais lien de deeplink'}
              onPress={() => {
                if (Linking.canOpenURL(BadDeeplink)) {
                  Linking.openURL(BadDeeplink)
                }
              }}
            />
          </Row>
          <Spacer.Column numberOfSpaces={2} />
          <Row>
            <Text>Simulation mauvais deeplink :</Text>
            <Link>
              <Text>{BadDeeplink}</Text>
            </Link>
          </Row>
          <Spacer.Column numberOfSpaces={5} />
        </StyledContainer>
      </ScrollView>
    </SafeContainer>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 1),
}))

const Link = styled.TouchableOpacity({
  width: '100%',
  textAlign: 'center',
  fontSize: 11,
})
