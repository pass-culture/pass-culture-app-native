import React from 'react'

import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { fireEvent, render, screen } from 'tests/utils'

import { AchievementDetailsModal } from './AchievementDetailsModal'

const hideModalMock = jest.fn()

describe('<AchievementDetailsModal/>', () => {
  it('should match snapshot', () => {
    render(
      <AchievementDetailsModal
        id={AchievementId.FIRST_ART_LESSON_BOOKING}
        visible
        hideModal={hideModalMock}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    render(
      <AchievementDetailsModal
        id={AchievementId.FIRST_ART_LESSON_BOOKING}
        visible
        hideModal={hideModalMock}
      />
    )

    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
