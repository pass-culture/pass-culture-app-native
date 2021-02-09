import React from 'react'

import { GenericTutorial } from 'features/firstLogin/tutorials/components/GenericTutorial'

import { FirstCard } from './components/FirstCard'
import { FourthCard } from './components/FourthCard'
import { SecondCard } from './components/SecondCard'
import { ThirdCard } from './components/ThirdCard'

export function FirstTutorial() {
  return (
    <GenericTutorial name="Tuto">
      <FirstCard />
      <SecondCard />
      <ThirdCard />
      <FourthCard />
    </GenericTutorial>
  )
}
