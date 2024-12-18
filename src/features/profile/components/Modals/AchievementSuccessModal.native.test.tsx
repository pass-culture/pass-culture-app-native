import React from 'react'

import { AchievementEnum, AchievementResponse } from 'api/gen'
import { AchievementSuccessModal } from 'features/profile/components/Modals/AchievementSuccessModal'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const achievementArtLesson: AchievementResponse = {
  name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
  id: 1,
  unlockedDate: new Date().toLocaleDateString(),
}
const achievementInstrument: AchievementResponse = {
  name: AchievementEnum.FIRST_INSTRUMENT_BOOKING,
  id: 2,
  unlockedDate: new Date().toLocaleDateString(),
}

describe('AchievementSuccessModal', () => {
  it('should show "Tu as débloqué un succès !" when one achievement is unlocked', () => {
    renderAchievementSuccessModal([achievementArtLesson])

    const wording = screen.getByText('Tu as débloqué un succès !')

    expect(wording).toBeTruthy()
  })

  it('should show "Tu as débloqué plusieurs succès !" when several achievements are unlocked', () => {
    renderAchievementSuccessModal([achievementArtLesson, achievementInstrument])

    const wording = screen.getByText('Tu as débloqué plusieurs succès !')

    expect(wording).toBeTruthy()
  })

  it('should log analytics with one achievement unlocked', () => {
    renderAchievementSuccessModal([achievementArtLesson])

    expect(analytics.logConsultAchievementsSuccessModal).toHaveBeenCalledWith([
      AchievementEnum.FIRST_ART_LESSON_BOOKING,
    ])
  })

  it('should log analytics with several achievements unlocked', () => {
    renderAchievementSuccessModal([achievementArtLesson, achievementInstrument])

    expect(analytics.logConsultAchievementsSuccessModal).toHaveBeenCalledWith([
      AchievementEnum.FIRST_ART_LESSON_BOOKING,
      AchievementEnum.FIRST_INSTRUMENT_BOOKING,
    ])
  })
})

const renderAchievementSuccessModal = (achievementsToShow: AchievementResponse[]) =>
  render(
    reactQueryProviderHOC(
      <AchievementSuccessModal
        visible
        hideModal={jest.fn()}
        achievementsToShow={achievementsToShow}
      />
    )
  )
