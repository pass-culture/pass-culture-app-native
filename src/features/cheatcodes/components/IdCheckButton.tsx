import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button } from 'react-native'

export const IdCheckButton: React.FC = () => {
  const { navigate } = useNavigation()
  return <Button title="IdCheck" onPress={() => navigate('IdCheck')} />
}
