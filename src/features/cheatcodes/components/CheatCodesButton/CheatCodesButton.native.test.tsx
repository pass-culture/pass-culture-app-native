import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, fireEvent } from 'tests/utils'

import { CheatCodesButton } from './CheatCodesButton'

describe('CheatCodesButton component', () => {
  it('should have a button to go to the cheatcodes section', () => {
    const component = render(<CheatCodesButton />)

    const Button = component.getByText('CheatCodes')
    fireEvent.press(Button)

    expect(navigate).toHaveBeenCalledWith('CheatCodes')
  })
})
