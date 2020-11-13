import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, Linking, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { _ } from 'libs/i18n'
import { SafeContainer } from 'ui/components/SafeContainer'
import { Spacer, Typo } from 'ui/theme'

import { CheatCodesButton } from '../components/CheatCodesButton'
import { IdCheckButton } from '../components/IdCheckButton'

const MdpDeeplink =
  DEEPLINK_DOMAIN + 'mot-de-passe-perdu?token=etjkdfldkfsd&expiration_date=4567894123450'

export function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <SafeContainer>
      <ScrollView>
        <Spacer.Column numberOfSpaces={5} />
        <CheatCodesButton />
        <Spacer.Column numberOfSpaces={5} />
        <IdCheckButton />
        <Spacer.Column numberOfSpaces={2} />
        <Button title={_(t`Page Login`)} onPress={() => navigation.navigate('Login')} />
        <Spacer.Column numberOfSpaces={2} />
        <Button
          title={'Page Reinitialisation de Mdp: email envoyé'}
          onPress={() =>
            // TODO => PC-4356
            navigation.navigate('ResetPasswordEmailSent', { userEmail: 'jean.dupont@gmail.com' })
          }
        />
        <Spacer.Column numberOfSpaces={2} />
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
      <Button title="CheatCodes" onPress={() => navigation.navigate('CheatCodes')} />
    </SafeContainer>
  )
}

type Props = { fontSize?: number }
const LittleDescription = styled(Typo.Caption).attrs<Props>(({ fontSize = 11 }) => ({
  fontSize,
}))<Props>(({ fontSize }) => ({
  width: '100%',
  textAlign: 'center',
  fontSize,
}))
