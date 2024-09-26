import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ScanIllustration } from 'ui/svg/icons/ScanIllustration'

export const ScanRoundedButton: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const onPress = () => {
    navigate('Scan')
  }

  return <RoundedButton Icon={ScanIllustration} onPress={onPress} />
}
