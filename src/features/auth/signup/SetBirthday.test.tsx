import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { ColorsEnum } from 'ui/theme'

import { SetBirthday } from './SetBirthday'

describe('SetBirthday Page', () => {
  it('should render properly', () => {
    const { toJSON } = render(<SetBirthday />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to the previous when back navigation triggered', () => {
    const { getByTestId } = render(<SetBirthday />)
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })
  it('should keep disabled the button "Continuer" when the date is not complete', () => {
    const { getByPlaceholderText, getByTestId } = render(<SetBirthday />)

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '1')
    fireEvent.changeText(month, '1')
    fireEvent.changeText(year, '1')

    const button = getByTestId('button-container')
    expect(button.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
  })
  it('should display the error message when the date is not correct', () => {
    const { getByText, getByPlaceholderText } = render(<SetBirthday />)

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '29')
    fireEvent.changeText(month, '02')
    fireEvent.changeText(year, '2005')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    getByText('La date choisie est incorrecte')
  })
  it('should enable the button "Continuer" when the date is correct', () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId } = render(<SetBirthday />)

    const day = getByPlaceholderText('JJ')
    const month = getByPlaceholderText('MM')
    const year = getByPlaceholderText('AAAA')

    fireEvent.changeText(day, '16')
    fireEvent.changeText(month, '01')
    fireEvent.changeText(year, '1995')

    const continueButton = getByText('Continuer')
    fireEvent.press(continueButton)

    const buttonContainer = getByTestId('button-container')
    expect(buttonContainer.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    expect(queryByText('La date choisie est incorrecte')).toBeFalsy()
  })
  it('should display a information modal when clicking "Pourquoi" link', () => {
    const { getByTestId } = render(<SetBirthday />)
    const birthdayModal = getByTestId('modal-birthday-information')
    expect(birthdayModal.props.visible).toBeFalsy()

    const whyBirthdayLink = getByTestId('button-title-why-link')
    fireEvent.press(whyBirthdayLink)

    expect(birthdayModal.props.visible).toBeTruthy()
  })
})
