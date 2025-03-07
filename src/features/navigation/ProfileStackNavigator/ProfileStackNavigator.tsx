import React from 'react'

import { ProfileStack } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { Profile } from 'features/profile/pages/Profile'

export const ProfileStackNavigator = () => (
  <ProfileStack.Navigator initialRouteName="Profile" screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    <ProfileStack.Screen name="Profile" component={Profile} options={{ title: 'Mon profil' }} />
  </ProfileStack.Navigator>
)
