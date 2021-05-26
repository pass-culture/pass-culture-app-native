import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { DeleteProfileSuccess } from './DeleteProfileSuccess'

describe('DeleteProfileSuccess component', () => {
  it('should render delete profile success', () => {
    const renderAPI = render(<DeleteProfileSuccess />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it(`should redirect to Home page when clicking on "Retourner à l'accueil" button`, () => {
    const renderAPI = render(<DeleteProfileSuccess />)
    fireEvent.press(renderAPI.getByText(`Retourner à l'accueil`))
    expect(navigate).toHaveBeenCalledWith('Home')
  })
})
