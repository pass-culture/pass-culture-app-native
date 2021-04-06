import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, fireEvent } from 'tests/utils'

import { AccountCreated } from './AccountCreated'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<AccountCreated />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const renderAPI = render(<AccountCreated />)

    const button = await renderAPI.findByText('On y va !')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })
})
