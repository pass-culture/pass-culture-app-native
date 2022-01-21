import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { analytics } from 'libs/analytics'
import { fireEvent, render, RenderAPI } from 'tests/utils'
import { ColorsEnum } from 'ui/theme/colors'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(new Date('2020-12-01T00:00:00Z'))
    jest.useFakeTimers()
  })

  it('should render properly', () => {
    const { toJSON } = render(<SetBirthday {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  describe('- error message -', () => {
    it('should display the error message when the date is incorrect', async () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '32/13/1889')

      await waitForExpect(() => {
        const message = renderAPI.queryByText(
          'La date n’existe pas. Exemple de résultat attendu\u00a0: 03/03/2003'
        )
        expect(message).toBeTruthy()
      })
    })

    it('should display the error message "date trop ancienne" when the date is too old', async () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '01/01/1889')

      await waitForExpect(() => {
        const message = renderAPI.queryByText(
          'Euh... Il semblerait qu’il y ait une erreur. As-tu réellement\u00a0131\u00a0ans\u00a0?'
        )
        expect(message).toBeTruthy()
      })
    })

    it('should display the error message "tu dois avoir 15 ans" when the date is too young', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '02/12/2005') // 15 years old - 1 day

      const message = renderAPI.queryByText(
        'Tu dois avoir au moins\u00a015\u00a0ans pour t’inscrire au pass Culture'
      )
      expect(message).toBeTruthy()
    })

    it('should not display the error message "tu dois avoir 15 ans" when the user is exactly 15yo', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '01/12/2005') // 15 years old

      const message = renderAPI.queryByText(
        'Tu dois avoir au moins\u00a015\u00a0ans pour t’inscrire au pass Culture'
      )
      expect(message).toBeFalsy()
    })
  })

  describe('- navigation -', () => {
    it('should open birthday information modal when clicking "Pour quelle raison ?" button', () => {
      const { getByText } = render(<SetBirthday {...props} />)

      const whyBirthdayLink = getByText('Pour quelle raison\u00a0?')
      fireEvent.press(whyBirthdayLink)
      expect('Pourquoi saisir ma date de naissance\u00a0?').toBeTruthy()
    })

    it('should keep disabled the button "Continuer" when the date is not complete', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '03/03/200')

      const button = renderAPI.getByTestId('Continuer')
      expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should call goToNextStep() when the date is not complete and press the button "Continuer"', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '16/01/1995')

      const continueButton = renderAPI.getByText('Continuer')
      fireEvent.press(continueButton)

      expect(props.goToNextStep).toBeCalledWith({ birthdate: '1995-01-16' })
    })
  })

  describe('- analytics -', () => {
    it('should log ConsultModalWhyAnniversary when clicking "Pour quelle raison ?" link', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const whyBirthdayLink = getByTestId('Pour quelle raison\u00a0?')
      fireEvent.press(whyBirthdayLink)

      expect(analytics.logConsultWhyAnniversary).toHaveBeenCalledTimes(1)
    })

    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '01/12/2005')
      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '01/12/2006')
      expect(analytics.logSignUpTooYoung).toBeCalledTimes(1)
    })
  })
})

function changeDate(renderAPI: RenderAPI, dateStr: string) {
  const dateInput = renderAPI.getByPlaceholderText('03/03/2003')
  fireEvent.changeText(dateInput, dateStr)
}
