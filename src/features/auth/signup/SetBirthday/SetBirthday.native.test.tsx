import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { analytics } from 'libs/analytics'
import { fireEvent, render, RenderAPI } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('SetBirthday Page', () => {
  beforeEach(() => {
    mockdate.set(new Date('2020-12-01T00:00:00Z'))
    jest.useFakeTimers()
  })

  it('should render properly', () => {
    const { toJSON } = render(<SetBirthday {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should keep disabled the button "Continuer" when the date is not complete', () => {
    const renderAPI = render(<SetBirthday {...props} />)

    changeDate(renderAPI, '1', '1', '1')

    const button = renderAPI.getByTestId('Continuer')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
  })

  it('should display the error message "date incorrecte" when the date is too old', async () => {
    const renderAPI = render(<SetBirthday {...props} />)

    changeDate(renderAPI, '31', '12', '1889')

    await waitForExpect(() => {
      const message = renderAPI.queryByText('La date choisie est incorrecte')
      expect(message).toBeTruthy()
    })
  })

  it('should display the error message "tu dois avoir 15 ans" when the date is too young', () => {
    const renderAPI = render(<SetBirthday {...props} />)

    changeDate(renderAPI, '02', '12', '2005') // 15 years old - 1 day

    const message = renderAPI.queryByText(
      'Tu dois avoir' + '\u00a0' + 15 + '\u00a0' + "ans pour t'inscrire"
    )
    expect(message).toBeTruthy()
  })

  it('should not display the error message "tu dois avoir 15 ans" when the user is exactly 15yo', () => {
    const renderAPI = render(<SetBirthday {...props} />)

    changeDate(renderAPI, '01', '12', '2005') // 15 years old

    const message = renderAPI.queryByText(
      'Tu dois avoir' + '\u00a0' + 15 + '\u00a0' + "ans pour t'inscrire"
    )
    expect(message).toBeFalsy()
  })

  it('should call goToNextStep()', () => {
    const renderAPI = render(<SetBirthday {...props} />)

    changeDate(renderAPI, '16', '01', '1995')

    const continueButton = renderAPI.getByText('Continuer')
    fireEvent.press(continueButton)

    expect(props.goToNextStep).toBeCalledWith({ birthdate: '1995-01-16' })
  })

  it('should display a information modal when clicking "Pourquoi" link', () => {
    const { getByTestId, toJSON } = render(<SetBirthday {...props} />)

    const whyBirthdayLink = getByTestId('Pourquoi\u00a0?')
    fireEvent.press(whyBirthdayLink)

    const birthdayModal = getByTestId('modal-birthday-information')
    expect(birthdayModal.props.visible).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  describe('SetBirthday - analytics', () => {
    it('should log ConsultModalWhyAnniversary when clicking "Pourquoi" link', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const whyBirthdayLink = getByTestId('Pourquoi\u00a0?')
      fireEvent.press(whyBirthdayLink)

      expect(analytics.logConsultWhyAnniversary).toHaveBeenCalledTimes(1)
    })

    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '01', '12', '2005')
      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      const renderAPI = render(<SetBirthday {...props} />)

      changeDate(renderAPI, '01', '12', '2006')
      expect(analytics.logSignUpTooYoung).toBeCalledTimes(1)
    })
  })
})

function changeDate(renderAPI: RenderAPI, dayStr: string, monthStr: string, yearStr: string) {
  const dateInput = renderAPI.getByTestId('Entrée pour la date de naissance')
  fireEvent.changeText(dateInput, [dayStr, monthStr, yearStr].join(''))
}
