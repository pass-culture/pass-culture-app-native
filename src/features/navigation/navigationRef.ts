import { NavigationContainerRef } from '@react-navigation/native'
import React from 'react'

export const navigationRef = React.createRef<NavigationContainerRef>()
export const isNavigationReadyRef = React.createRef<boolean>()
