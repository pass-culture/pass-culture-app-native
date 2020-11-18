import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const CheatCodesButton: React.FC = () => {
  const { navigate } = useNavigation()
  return <ButtonPrimary title="CheatCodes" onPress={() => navigate('CheatCodes')} />
}
