import { t } from '@lingui/macro'
import React from 'react'
import { Text, View } from 'react-native'

import { _ } from 'libs/i18n'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'

export function ChangePassword() {
  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Mot de passe`)} />
      <View>
        <Text>Mot de passe</Text>
      </View>
    </React.Fragment>
  )
}
