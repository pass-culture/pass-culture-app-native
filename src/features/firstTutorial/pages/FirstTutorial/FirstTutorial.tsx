import React from 'react'
import { BackHandler } from 'react-native'

import { storage } from 'libs/storage'
import { GenericAchievement } from 'ui/components/achievements'

import { FirstCard } from './components/FirstCard'
import { FourthCard } from './components/FourthCard'
import { SecondCard } from './components/SecondCard'
import { ThirdCard } from './components/ThirdCard'

export function FirstTutorial() {
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

function onFirstCardBackAction() {
  BackHandler.exitApp()
}
