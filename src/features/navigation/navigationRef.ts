import { NavigationContainerRef } from '@react-navigation/native'
import React from 'react'

import { AllNavParamList } from 'features/navigation/RootNavigator'

export const navigationRef = React.createRef<NavigationContainerRef<AllNavParamList>>()
