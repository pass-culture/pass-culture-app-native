import React from 'react'

import { AchievementSuccessModal } from 'features/profile/components/Modals/AchievementSuccessModal'
import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics'
import { render, screen } from 'tests/utils'

describe('AchievementSuccessModal', () => {
  it('should show "Tu as débloqué un succès !" when one achievement is unlocked', () => {
    render(
      <AchievementSuccessModal
        visible
        hideModal={jest.fn()}
        ids={[AchievementId.FIRST_ART_LESSON_BOOKING]}
      />
    )

    const wording = screen.getByText('Tu as débloqué un succès !')

    expect(wording).toBeTruthy()
  })

  it('should show "Tu as débloqué plusieurs succès !" when several achievements are unlocked', () => {
    render(
      <AchievementSuccessModal
        visible
        hideModal={jest.fn()}
        ids={[AchievementId.FIRST_ART_LESSON_BOOKING, AchievementId.FIRST_INSTRUMENT_BOOKING]}
      />
    )

    const wording = screen.getByText('Tu as débloqué plusieurs succès !')

    expect(wording).toBeTruthy()
  })

  it('should log analytics with one achievement unlocked', () => {
    render(
      <AchievementSuccessModal
        visible
        hideModal={jest.fn()}
        ids={[AchievementId.FIRST_ART_LESSON_BOOKING]}
      />
    )

    expect(analytics.logConsultAchievementsSuccessModal).toHaveBeenCalledWith([
      AchievementId.FIRST_ART_LESSON_BOOKING,
    ])
  })

  it('should log analytics with several achievements unlocked', () => {
    render(
      <AchievementSuccessModal
        visible
        hideModal={jest.fn()}
        ids={[AchievementId.FIRST_ART_LESSON_BOOKING, AchievementId.FIRST_INSTRUMENT_BOOKING]}
      />
    )

    expect(analytics.logConsultAchievementsSuccessModal).toHaveBeenCalledWith([
      AchievementId.FIRST_ART_LESSON_BOOKING,
      AchievementId.FIRST_INSTRUMENT_BOOKING,
    ])
  })
})
