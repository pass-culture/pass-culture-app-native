import React, { ComponentProps } from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { fireEvent, render, screen } from 'tests/utils'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const hideModalMock = jest.fn()

describe('<SurveyModal />', () => {
  it('should redirect to survey when pressing "Répondre au questionnaire" button', () => {
    renderSurveyModal({ surveyUrl: 'https://fr.wikipedia.org/wiki/FIEALD' })

    fireEvent.press(screen.getByText('Répondre au questionnaire'))

    expect(openUrl).toHaveBeenCalledWith('https://fr.wikipedia.org/wiki/FIEALD', undefined, true)
  })

  it('should call hideModal function when pressing close icon', () => {
    renderSurveyModal({})
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should display "Répondre au questionnaire" button when survey url defined', () => {
    renderSurveyModal({ surveyUrl: 'https://fr.wikipedia.org/wiki/FIEALD' })

    expect(screen.getByText('Répondre au questionnaire')).toBeOnTheScreen()
  })

  it('should not display "Répondre au questionnaire" button when survey url not defined', () => {
    renderSurveyModal({})

    expect(screen.queryByText('Répondre au questionnaire')).not.toBeOnTheScreen()
  })
})

type RenderSurveyModalType = Partial<ComponentProps<typeof SurveyModal>>

const renderSurveyModal = ({ surveyUrl }: RenderSurveyModalType) => {
  return render(
    <SurveyModal
      visible
      hideModal={hideModalMock}
      surveyUrl={surveyUrl}
      title="Wikipedia"
      Icon={BicolorCircledClock}
    />
  )
}
