import React from 'react'

import { AchievementEnum } from 'api/gen'
import { render, screen, userEvent } from 'tests/utils'

import { AchievementDetailsModal } from './AchievementDetailsModal'

const hideModalMock = jest.fn()
const user = userEvent.setup()
jest.useFakeTimers()

describe('<AchievementDetailsModal/>', () => {
  it('should call hideModal function when clicking on Close icon', async () => {
    render(
      <AchievementDetailsModal
        name={AchievementEnum.FIRST_ART_LESSON_BOOKING}
        visible
        hideModal={hideModalMock}
      />
    )

    const rightIcon = screen.getByTestId('Fermer la modale')
    await user.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
