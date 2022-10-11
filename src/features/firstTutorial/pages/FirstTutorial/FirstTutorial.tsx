import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { BackHandler } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { storage } from 'libs/storage'
import { GenericAchievement } from 'ui/components/achievements'

import { FirstCard } from './components/FirstCard'
import { FourthCard } from './components/FourthCard'
import { SecondCard } from './components/SecondCard'
import { ThirdCard } from './components/ThirdCard'

type Props = StackScreenProps<RootStackParamList, 'FirstTutorial'>

export function FirstTutorial({ route }: Props) {
  const onFirstCardBackAction = route.params?.shouldCloseAppOnBackAction
    ? BackHandler.exitApp
    : undefined
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

function onSkip() {
  storage.saveObject('has_seen_tutorials', true)
}
