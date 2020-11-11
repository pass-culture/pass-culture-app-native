import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, Linking, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { formatDeeplinkDomain } from 'features/deeplinks'
import { _ } from 'libs/i18n'
import { SafeContainer } from 'ui/components/SafeContainer'
import { Spacer, Typo } from 'ui/theme'

import { CheatCodesButton } from '../components/CheatCodesButton'

const MdpDeeplink =
  formatDeeplinkDomain() + 'mot-de-passe-perdu?token=etjkdfldkfsd&expiration_date=4567894123'

export function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <SafeContainer>
      <ScrollView>
        <Spacer.Column numberOfSpaces={5} />
        <CheatCodesButton />
        <Spacer.Column numberOfSpaces={5} />
        <Button title={_(t`Page Login`)} onPress={() => navigation.navigate('Login')} />
        <Spacer.Column numberOfSpaces={5} />
        <Button
          title={_(t`Page Reinitialisation de Mdp`)}
          onPress={() => {
            if (Linking.canOpenURL(MdpDeeplink)) {
              Linking.openURL(MdpDeeplink)
            }
          }}
        />
        <LittleDescription>{_(t`simulate email deeplink clic with:`)}</LittleDescription>
        <LittleDescription>{MdpDeeplink}</LittleDescription>
        <Spacer.Column numberOfSpaces={5} />
      </ScrollView>
    </SafeContainer>
  )
}

export default Navigation

type Props = { fontSize?: number }
const LittleDescription = styled(Typo.Caption).attrs<Props>(({ fontSize = 11 }) => ({
  fontSize,
}))<Props>(({ fontSize }) => ({
  width: '100%',
  textAlign: 'center',
  fontSize,
}))
