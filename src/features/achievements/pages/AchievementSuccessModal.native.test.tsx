import React from 'react'

import * as API from 'api/api'
import { AchievementEnum, AchievementResponse } from 'api/gen'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { analytics } from 'libs/analytics/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

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

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const apiPostAchievementsMarkAsSeen = jest.spyOn(API.api, 'postNativeV1AchievementsMarkAsSeen')

jest.useFakeTimers()

describe('AchievementSuccessModal', () => {
  beforeEach(() => {
    mockServer.postApi('/v1/achievements/mark_as_seen', {})
  })

  it('should show "Tu as débloqué un succès !" when one achievement is unlocked', async () => {
    renderAchievementSuccessModal([achievementArtLesson])

    const wording = await screen.findByText('Tu as débloqué un succès !')

    expect(wording).toBeTruthy()
  })

  it('should show "Tu as débloqué plusieurs succès !" when several achievements are unlocked', async () => {
    renderAchievementSuccessModal([achievementArtLesson, achievementInstrument])

    const wording = await screen.findByText('Tu as débloqué plusieurs succès !')

    expect(wording).toBeTruthy()
  })

  it('should log analytics with one achievement unlocked', async () => {
    renderAchievementSuccessModal([achievementArtLesson])

    await screen.findByText('Tu as débloqué un succès !')

    expect(analytics.logConsultAchievementsSuccessModal).toHaveBeenCalledWith([
      AchievementEnum.FIRST_ART_LESSON_BOOKING,
    ])
  })

  it('should log analytics with several achievements unlocked', async () => {
    renderAchievementSuccessModal([achievementArtLesson, achievementInstrument])

    await screen.findByText('Tu as débloqué plusieurs succès !')

    expect(analytics.logConsultAchievementsSuccessModal).toHaveBeenCalledWith([
      AchievementEnum.FIRST_ART_LESSON_BOOKING,
      AchievementEnum.FIRST_INSTRUMENT_BOOKING,
    ])
  })

  it('should not mark achievements as seen when showing the modal', async () => {
    renderAchievementSuccessModal([achievementArtLesson, achievementInstrument])

    await screen.findByText('Tu as débloqué plusieurs succès !')

    expect(apiPostAchievementsMarkAsSeen).not.toHaveBeenCalled()
  })

  it('should mark achievements as seen when closing the modal', async () => {
    renderAchievementSuccessModal([achievementArtLesson, achievementInstrument])

    await screen.findByText('Tu as débloqué plusieurs succès !')

    const exitButton = await screen.findByText('Accéder à mes succès')

    const user = userEvent.setup()
    await user.press(exitButton)

    expect(apiPostAchievementsMarkAsSeen).toHaveBeenCalledWith({ achievementIds: [1, 2] })
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
