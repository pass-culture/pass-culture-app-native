import React, { useEffect } from 'react'

import { storage } from 'libs/storage'
import { GenericAchievement } from 'ui/components/achievements'

import { EighteenBirthdayCard } from '../components/EighteenBirthdayCard'

export function EighteenBirthday() {
  useEffect(() => {
    storage.saveObject('has_seen_eligible_card', true)
  }, [])

  return (
    <GenericAchievement screenName="EighteenBirthday">
      <EighteenBirthdayCard />
    </GenericAchievement>
  )
}
