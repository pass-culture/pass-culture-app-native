import React, { ComponentProps } from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { CircledClock } from 'ui/svg/icons/CircledClock'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const hideModalMock = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SurveyModal />', () => {
  it('should redirect to survey when pressing "Répondre au questionnaire" button', async () => {
    renderSurveyModal({ surveyUrl: 'https://fr.wikipedia.org/wiki/FIEALD' })

    await user.press(screen.getByText('Répondre au questionnaire'))

    await waitFor(() => {
      expect(openUrl).toHaveBeenNthCalledWith(
        1,
        'https://fr.wikipedia.org/wiki/FIEALD',
        undefined,
        true
      )
    })
  })

  it('should call hideModal function when pressing close icon', async () => {
    renderSurveyModal({ surveyUrl: 'https://fr.wikipedia.org/wiki/FIEALD' })
    const rightIcon = screen.getByTestId('Fermer la modale')
    await user.press(rightIcon)

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

  it('should call hideModal function  when pressing "Répondre au questionnaire" button', async () => {
    renderSurveyModal({ surveyUrl: 'https://fr.wikipedia.org/wiki/FIEALD' })

    await user.press(screen.getByText('Répondre au questionnaire'))

    await waitFor(() => {
      expect(hideModalMock).toHaveBeenCalledTimes(1)
    })
  })
})

type RenderSurveyModalType = Pick<ComponentProps<typeof SurveyModal>, 'surveyUrl'>

const renderSurveyModal = ({ surveyUrl }: RenderSurveyModalType) => {
  return render(
    <SurveyModal
      visible
      hideModal={hideModalMock}
      surveyUrl={surveyUrl}
      title="Wikipedia"
      Icon={CircledClock}
    />
  )
}
