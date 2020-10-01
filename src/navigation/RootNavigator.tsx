import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // @react-navigation
import { createStackNavigator } from '@react-navigation/stack'; // @react-navigation

import { Home, Login, CheatCodes } from '../pages';

export type RootStackParamList = {
  Home: undefined;
  Login?: { userId: string };
  CheatCodes: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen
          name="Login"
          component={Login}
          initialParams={{ userId: 'test_user_id' }}
        />
        <RootStack.Screen name="CheatCodes" component={CheatCodes} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
