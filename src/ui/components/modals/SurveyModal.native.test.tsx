import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { fireEvent, render, screen } from 'tests/utils'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const hideModalMock = jest.fn()

describe('<SurveyModal />', () => {
  it('should redirect to survey when pressing "Répondre au questionnaire" button', () => {
    renderSurveyModal()

    fireEvent.press(screen.getByText('Répondre au questionnaire'))

    expect(openUrl).toHaveBeenCalledWith('https://fr.wikipedia.org/wiki/FIEALD', undefined, true)
  })

  it('should call hideModal function when pressing close icon', () => {
    renderSurveyModal()
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})

const renderSurveyModal = () => {
  return render(
    <SurveyModal
      visible
      hideModal={hideModalMock}
      surveyUrl="https://fr.wikipedia.org/wiki/FIEALD"
      title="Wikipedia"
      Icon={BicolorCircledClock}
    />
  )
}
