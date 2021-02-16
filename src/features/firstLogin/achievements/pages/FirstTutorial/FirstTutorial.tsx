import React from 'react'

import { storage } from 'libs/storage'
import { GenericAchievement } from 'ui/components/achievements'

import { FirstCard } from './components/FirstCard'
import { FourthCard } from './components/FourthCard'
import { SecondCard } from './components/SecondCard'
import { ThirdCard } from './components/ThirdCard'

export function FirstTutorial() {
  function skip() {
    storage.saveObject('has_seen_tutorials', true)
  }

  return (
    <GenericAchievement name="FirstTutorial" skip={skip}>
      <FirstCard />
      <SecondCard />
      <ThirdCard />
      <FourthCard />
    </GenericAchievement>
  )
}
