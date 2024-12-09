import React from 'react'

import { AchievementEnum } from 'api/gen'
import { fireEvent, render, screen } from 'tests/utils'

import { AchievementDetailsModal } from './AchievementDetailsModal'

const hideModalMock = jest.fn()

describe('<AchievementDetailsModal/>', () => {
  it('should call hideModal function when clicking on Close icon', () => {
    render(
      <AchievementDetailsModal
        name={AchievementEnum.FIRST_ART_LESSON_BOOKING}
        visible
        hideModal={hideModalMock}
      />
    )

    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
