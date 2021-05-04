import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, fireEvent } from 'tests/utils'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<BeneficiaryRequestSent />', () => {
  it('should redirect to cultural survey page WHEN "On y va !" button is clicked', async () => {
    const { findByText } = render(<BeneficiaryRequestSent />)

    const button = await findByText('On y va !')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('CulturalSurvey')
  })
})
