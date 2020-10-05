import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Button } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator'

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>

type Props = {
  navigation: LoginScreenNavigationProp
}

export const CheatCodesButton: React.FC<Props> = (props) => (
  <Button title="CheatCodes" onPress={() => props.navigation.navigate('CheatCodes')} />
)
