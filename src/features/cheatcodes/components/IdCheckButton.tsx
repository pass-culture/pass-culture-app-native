import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const IdCheckButton: React.FC = () => {
  const { navigate } = useNavigation()
  return <ButtonPrimary title="IdCheck" onPress={() => navigate('IdCheck')} />
}
