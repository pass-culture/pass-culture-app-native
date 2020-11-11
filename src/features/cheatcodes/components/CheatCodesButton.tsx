import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button } from 'react-native'

export const CheatCodesButton: React.FC = () => {
  const { navigate } = useNavigation()
  return <Button title="CheatCodes" onPress={() => navigate('CheatCodes')} />
}
