import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { fireEvent, render, screen } from 'tests/utils'
import { FakeDoorModal } from 'ui/components/modals/FakeDoorModal'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const hideModalMock = jest.fn()

describe('<FakeDoorModal />', () => {
  it('should redirect to survey when pressing "Répondre au questionnaire" button', () => {
    render(
      <FakeDoorModal
        visible
        hideModal={hideModalMock}
        surveyUrl="https://fr.wikipedia.org/wiki/FIEALD"
      />
    )

    fireEvent.press(screen.getByText('Répondre au questionnaire'))

    expect(openUrl).toHaveBeenCalledWith('https://fr.wikipedia.org/wiki/FIEALD', undefined, true)
  })

  it('should call hideModal function when pressing close icon', () => {
    render(
      <FakeDoorModal
        visible
        hideModal={hideModalMock}
        surveyUrl="https://fr.wikipedia.org/wiki/FIEALD"
      />
    )
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
