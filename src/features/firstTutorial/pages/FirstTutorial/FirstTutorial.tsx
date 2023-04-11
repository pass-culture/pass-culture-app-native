import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { BackHandler, Platform } from 'react-native'

import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { storage } from 'libs/storage'
import { GenericAchievement } from 'ui/components/achievements'

import { FirstCard } from './components/FirstCard'
import { FourthCard } from './components/FourthCard'
import { SecondCard } from './components/SecondCard'
import { ThirdCard } from './components/ThirdCard'

type Props = StackScreenProps<RootStackParamList, 'FirstTutorial'>

export function FirstTutorial({ route }: Props) {
  const { reset, navigate } = useNavigation<UseNavigationType>()
  const onFirstCardBackAction = route.params?.shouldCloseAppOnBackAction
    ? BackHandler.exitApp
    : undefined

  const onSkip = useCallback(() => {
    storage.saveObject('has_seen_tutorials', true)
    if (Platform.OS === 'web') {
      reset({
        index: 0,
        routes: [{ name: 'TabNavigator', state: { routes: [{ name: 'Profile' }] } }],
      })
    } else {
      navigate(...getTabNavConfig('Profile'))
    }
  }, [navigate, reset])

  return (
    <GenericAchievement
      screenName="FirstTutorial"
      skip={onSkip}
      onFirstCardBackAction={onFirstCardBackAction}>
      <FirstCard />
      <SecondCard />
      <ThirdCard />
      <FourthCard />
    </GenericAchievement>
  )
}
