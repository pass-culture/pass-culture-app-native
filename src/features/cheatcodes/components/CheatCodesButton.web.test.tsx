import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, fireEvent } from 'tests/utils/web'

import { CheatCodesButton } from './CheatCodesButton'

describe('CheatCodesButton component', () => {
  it('should have a button to go to the Login', () => {
    const component = render(<CheatCodesButton />)

    const Button = component.getByText('CheatCodes')
    fireEvent.click(Button)

    expect(navigate).toHaveBeenCalledWith('CheatCodes')
  })
})
