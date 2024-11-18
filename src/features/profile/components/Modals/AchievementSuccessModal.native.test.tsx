import React from 'react'

import { AchievementSuccessModal } from 'features/profile/components/Modals/AchievementSuccessModal'
import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { render, screen } from 'tests/utils'

describe('AchievementSuccessModal', () => {
  it('should show right text when one achievement is unlocked', () => {
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

  it('should show right text when several achievements are unlocked', () => {
    render(
      <AchievementSuccessModal
        visible
        hideModal={jest.fn()}
        ids={[AchievementId.FIRST_ART_LESSON_BOOKING, AchievementId.FIRST_INSTRUMENT_BOOKING]}
      />
    )

    const wording = screen.getByText('Tu as débloqué des succès !')

    expect(wording).toBeTruthy()
  })
})
