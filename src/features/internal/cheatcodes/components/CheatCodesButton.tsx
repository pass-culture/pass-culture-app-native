import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const CheatCodesButton: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return <ButtonPrimary wording="CheatCodes" onPress={() => navigate('CheatCodes')} />
}
