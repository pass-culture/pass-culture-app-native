import React from 'react';
import { Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../navigation';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type Props = {
  navigation: LoginScreenNavigationProp;
};
export const CheatCodesButton = (props: Props) => (
  <Button title="CheatCodes" onPress={() => props.navigation.navigate('CheatCodes')} />
);
