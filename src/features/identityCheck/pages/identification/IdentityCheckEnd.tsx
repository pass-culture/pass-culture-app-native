import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { getSpacing } from 'ui/theme'

export const IdentityCheckEnd = () => {
  const navigation = useNavigation<UseNavigationType>()

  useEffect(() => {
    setTimeout(() => navigation.navigate('IdentityCheck'), 3000)
  }, [])

  return (
    <GenericInfoPage
      title={t`Ta pièce d’identité a bien été transmise !`}
      icon={EmailSent}
      iconSize={getSpacing(42)}
    />
  )
}
